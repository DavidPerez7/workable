#!/bin/bash

# Script principal para ejecutar el proyecto Workable (Backend + Frontend)
# Proporciona opciones para ejecutar backend, frontend o ambos en terminales separadas
# Mejorado con: error handling robusto, logging detallado, health checks

set -e

FAST_MODE=false
QUIET_MODE=false
PARALLEL_MODE=false

# Colores para output (solo si no quiet)
if [ "$QUIET_MODE" = false ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    CYAN='\033[0;36m'
    BOLD='\033[1m'
    NC='\033[0m' # No Color
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    CYAN=''
    BOLD='\033[1m'  # Bold sigue para importantes
    NC=''
fi

# Rutas relativas
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
# La UI web ahora está en frontend/web (la carpeta frontend contiene mobile + web)
FRONTEND_DIR="$SCRIPT_DIR/frontend/web"

# Puertos
BACKEND_PORT=8080
FRONTEND_PORT=5173

# Archivos de log y PID
LOG_DIR="/tmp/workable-logs"
BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"
BACKEND_PID_FILE="$LOG_DIR/backend.pid"
FRONTEND_PID_FILE="$LOG_DIR/frontend.pid"
HEALTH_CHECK_LOG="$LOG_DIR/health-check.log"

# Crear directorio de logs
mkdir -p "$LOG_DIR"

# Restaurar estado del terminal para evitar secuencias como ^[[127u (CSI-u)
sanitize_terminal() {
    # Recuperar modo canonical/echo por si algun comando dejo el tty en modo raro
    stty sane 2>/dev/null || true
    tput cnorm 2>/dev/null || true

    # Desactivar protocolos de teclado extendido comunes (xterm/kitty)
    printf '\033[>4;0m' 2>/dev/null || true
    printf '\033[<u' 2>/dev/null || true
}

# Asegurar limpieza del tty al salir (solo en interactivo)
trap 'if [ "$QUIET_MODE" = false ]; then sanitize_terminal; fi' EXIT

# Normalizar terminal solo en modo interactivo
if [ "$QUIET_MODE" = false ]; then
    sanitize_terminal
fi

# ===== FUNCIONES AUXILIARES =====

print_header() {
    if [ "$QUIET_MODE" = false ]; then
        echo -e "${BOLD}$1${NC}"
    fi
}

print_success() {
    if [ "$QUIET_MODE" = false ]; then
        echo -e "${GREEN}✓ $1${NC}"
    fi
}

print_error() {
    echo -e "${BOLD}${RED}✗ $1${NC}"
}

print_warning() {
    if [ "$QUIET_MODE" = false ]; then
        echo -e "${YELLOW}⚠ $1${NC}"
    fi
}

print_info() {
    if [ "$QUIET_MODE" = false ]; then
        echo -e "${CYAN}ℹ $1${NC}"
    fi
}

# Verificar si una herramienta está disponible
check_command() {
    if ! command -v $1 &> /dev/null; then
        return 1
    fi
    return 0
}

# Verificar dependencias del proyecto
check_dependencies() {
    if [ -f ".deps_checked" ] && [ "$FAST_MODE" = true ]; then
        print_success "DEPENDENCIES: Cache válido, saltando verificación"
        return 0
    fi
    
    print_info "DEPENDENCIES: Verificando..."
    
    local deps_ok=true
    
    # Verificar Node.js y npm
    if ! check_command "node"; then
        print_error "DEPENDENCIES: Node.js no encontrado"
        deps_ok=false
    else
        print_success "DEPENDENCIES: Node.js $(node --version)"
    fi
    
    if ! check_command "npm"; then
        print_error "DEPENDENCIES: npm no encontrado"
        deps_ok=false
    else
        print_success "DEPENDENCIES: npm $(npm --version)"
    fi
    
    # Verificar Java y Maven
    if ! check_command "java"; then
        print_error "DEPENDENCIES: Java no encontrado"
        deps_ok=false
    else
        print_success "DEPENDENCIES: Java $(java -version 2>&1 | head -n 1)"
    fi
    
    if ! check_command "mvn"; then
        print_error "DEPENDENCIES: Maven no encontrado"
        deps_ok=false
    else
        print_success "DEPENDENCIES: Maven $(mvn --version | head -n 1)"
    fi
    
    if [ "$deps_ok" = false ]; then
        print_error "DEPENDENCIES: Faltan dependencias"
        return 1
    fi
    
    print_success "DEPENDENCIES: Todas disponibles"
    touch .deps_checked
    return 0
}

# Limpiar procesos de puertos específicos
kill_port_process() {
    local port=$1
    
    if command -v lsof &> /dev/null; then
        if lsof -i :$port > /dev/null 2>&1; then
            print_warning "Puerto $port está en uso. Intentando liberar..."
            local pids=$(lsof -ti :$port)
            for pid in $pids; do
                kill -9 $pid 2>/dev/null || true
                print_success "Proceso PID $pid en puerto $port terminado"
            done
        fi
    else
        print_warning "lsof no disponible, omitiendo limpieza de puertos"
    fi
}

# Limpieza agresiva de procesos del backend
force_kill_backend() {
    print_info "SYSTEM: Limpieza backend..."
    local killed=false
    
    # Terminar procesos Java con "workable"
    if pkill -f "workable.*\.jar" 2>/dev/null; then
        print_success "SYSTEM: Procesos Java workable terminados"
        killed=true
    fi
    
    # Terminar en puerto
    if command -v lsof &> /dev/null && lsof -ti :$BACKEND_PORT > /dev/null 2>&1; then
        local pids=$(lsof -ti :$BACKEND_PORT)
        for pid in $pids; do
            kill -9 $pid 2>/dev/null || true
        done
        print_success "SYSTEM: Procesos en puerto $BACKEND_PORT terminados"
        killed=true
    fi
    
    if [ "$killed" = false ]; then
        print_info "SYSTEM: No procesos backend"
    fi
    
    sleep 1
}

# Limpieza agresiva de procesos del frontend
force_kill_frontend() {
    print_info "SYSTEM: Limpieza frontend..."
    local killed=false
    
    # Terminar procesos Vite/Node
    if pkill -f "vite" 2>/dev/null; then
        print_success "SYSTEM: Procesos Vite terminados"
        killed=true
    fi
    
    # Terminar en puerto
    if command -v lsof &> /dev/null && lsof -ti :$FRONTEND_PORT > /dev/null 2>&1; then
        local pids=$(lsof -ti :$FRONTEND_PORT)
        for pid in $pids; do
            kill -9 $pid 2>/dev/null || true
        done
        print_success "SYSTEM: Procesos en puerto $FRONTEND_PORT terminados"
        killed=true
    fi
    
    # Terminar procesos Node frontend
    if pkill -f "node.*frontend" 2>/dev/null; then
        print_success "SYSTEM: Procesos Node frontend terminados"
        killed=true
    fi
    
    # Fallback: matar todos Node
    if pgrep node > /dev/null 2>&1; then
        pkill -9 node 2>/dev/null || true
        print_success "SYSTEM: Todos Node terminados"
        killed=true
    fi
    
    if [ "$killed" = false ]; then
        print_info "SYSTEM: No procesos frontend"
    fi
    
    sleep 1
}

# Verificar y iniciar MariaDB
ensure_mysql_running() {
    print_info "DATABASE: Verificando MariaDB..."
    
    if pgrep -x "mariadbd" > /dev/null || pgrep -x "mysqld" > /dev/null; then
        print_success "DATABASE: MariaDB/MySQL ya está corriendo"
        return 0
    fi
    
    print_info "DATABASE: Iniciando MariaDB con systemctl..."
    if sudo systemctl start mariadb 2>&1 | tee -a "$HEALTH_CHECK_LOG"; then
        print_success "DATABASE: MariaDB iniciado"
        sleep 1  # Espera mínima reducida
        if mysqladmin ping --silent; then
            print_success "DATABASE: MariaDB verificado y corriendo"
            return 0
        else
            print_error "DATABASE: MariaDB no responde después de iniciar"
            return 1
        fi
    else
        print_error "DATABASE: No se pudo iniciar MariaDB con systemctl"
        return 1
    fi
}

# Health check para el backend
check_backend_health() {
    local max_attempts=25
    local attempt=1
    
    print_info "BACKEND: Health check (${max_attempts} intentos)..."
    
    while [ $attempt -le $max_attempts ]; do
        # Verificar si el puerto está escuchando Y si el endpoint responde
        if netstat -tuln 2>/dev/null | grep -q ":$BACKEND_PORT " || ss -tuln 2>/dev/null | grep -q ":$BACKEND_PORT "; then
            # Puerto abierto, ahora verificar que responde
            if curl --max-time 5 -s http://localhost:$BACKEND_PORT/api/municipio > /dev/null 2>&1; then
                print_success "BACKEND: Respondiendo"
                return 0
            fi
        fi
        
        sleep 1
        attempt=$((attempt + 1))
    done
    
    print_error "BACKEND: No responde después de ${max_attempts} intentos"
    return 1
}

# Validar que el frontend tenga una version de Node compatible antes de intentar instalar dependencias
check_frontend_node_version() {
    if ! check_command "node"; then
        print_error "Node.js no está instalado o no está en PATH"
        return 1
    fi

    local node_major
    node_major=$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo 0)

    if [ "$node_major" -lt 18 ]; then
        print_error "La versión de Node.js es incompatible para el frontend: $(node --version)"
        print_error "Instala Node.js 18 o superior antes de ejecutar el frontend"
        return 1
    fi

    print_success "Node.js compatible para frontend: $(node --version)"
    return 0
}

# Instalar dependencias del frontend solo cuando falten y fallar si la instalación no funciona
ensure_frontend_dependencies() {
    cd "$FRONTEND_DIR"

    if [ ! -f "package.json" ]; then
        print_error "FRONTEND: package.json no encontrado"
        return 1
    fi

    if [ -d "node_modules" ]; then
        print_success "FRONTEND: node_modules ya existe"
        return 0
    fi

    if ! check_frontend_node_version; then
        return 1
    fi

    print_info "FRONTEND: Instalando dependencias..."
    NPM_CMD="npm install --legacy-peer-deps"
    if [ "$FAST_MODE" = true ] && [ -f "package-lock.json" ]; then
        NPM_CMD="npm ci --prefer-offline"
    fi
    if ! $NPM_CMD 2>&1 | tee -a "$FRONTEND_LOG"; then
        local install_exit_code=${PIPESTATUS[0]}
        print_error "FRONTEND: Error instalando dependencias"
        return "$install_exit_code"
    fi

    print_success "FRONTEND: Dependencias instaladas"
    return 0
}

# Validar que existen los directorios y archivos necesarios
validate_project_structure() {
    if [ -f ".structure_checked" ] && [ "$FAST_MODE" = true ]; then
        print_success "STRUCTURE: Cache válido, saltando validación"
        return 0
    fi
    
    print_info "STRUCTURE: Validando..."
    
    if [ ! -d "$BACKEND_DIR" ]; then
        print_error "STRUCTURE: Backend dir no encontrado"
        return 1
    fi
    print_success "STRUCTURE: Backend dir ok"
    
    if [ ! -f "$BACKEND_DIR/pom.xml" ]; then
        print_error "STRUCTURE: pom.xml no encontrado"
        return 1
    fi
    print_success "STRUCTURE: pom.xml ok"
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        print_error "STRUCTURE: Frontend dir no encontrado"
        return 1
    fi
    print_success "STRUCTURE: Frontend dir ok"
    
    if [ ! -f "$FRONTEND_DIR/package.json" ]; then
        print_error "STRUCTURE: package.json no encontrado"
        return 1
    fi
    print_success "STRUCTURE: package.json ok"
    
    touch .structure_checked
    return 0
}

# Detener procesos del proyecto
stop_all_processes() {
    print_info "SYSTEM: Deteniendo procesos..."
    
    local stopped=false
    
    # Detener backend si existe el PID guardado
    if [ -f "$BACKEND_PID_FILE" ]; then
        local backend_pid=$(cat "$BACKEND_PID_FILE")
        if kill -0 $backend_pid 2>/dev/null; then
            kill -9 $backend_pid 2>/dev/null || true
            print_success "SYSTEM: Backend detenido (PID $backend_pid)"
            stopped=true
        fi
        rm -f "$BACKEND_PID_FILE"
    fi
    
    # Detener frontend si existe el PID guardado
    if [ -f "$FRONTEND_PID_FILE" ]; then
        local frontend_pid=$(cat "$FRONTEND_PID_FILE")
        if kill -0 $frontend_pid 2>/dev/null; then
            kill -9 $frontend_pid 2>/dev/null || true
            print_success "SYSTEM: Frontend detenido (PID $frontend_pid)"
            stopped=true
        fi
        rm -f "$FRONTEND_PID_FILE"
    fi
    
    # Matar todos los procesos java y node como alternativa
    if pgrep java > /dev/null; then
        pkill -9 java 2>/dev/null || true
        print_success "SYSTEM: Procesos Java detenidos"
        stopped=true
    fi
    
    if pgrep node > /dev/null; then
        pkill -9 node 2>/dev/null || true
        print_success "SYSTEM: Procesos Node detenidos"
        stopped=true
    fi
    
    sleep 1
    
    if [ "$stopped" = true ]; then
        print_success "SYSTEM: Todos los procesos detenidos"
    else
        print_warning "SYSTEM: No hay procesos en ejecución"
    fi
}

shutdown_on_signal() {
    print_warning "Ctrl+C detectado. Deteniendo todos los procesos iniciados por el script..."
    stop_all_processes
    sanitize_terminal
    exit 130
}

# Capturar interrupciones para cerrar todo correctamente
trap 'shutdown_on_signal' INT TERM

# ===== FUNCIONES PRINCIPALES =====

run_backend() {
    print_info "BACKEND: Iniciando..."
    
    # Asegurar que MySQL está corriendo
    if ! ensure_mysql_running; then
        print_error "BACKEND: No se puede iniciar sin database"
        return 1
    fi
    
    cd "$BACKEND_DIR"
    
    if [ ! -f "pom.xml" ]; then
        print_error "BACKEND: pom.xml no encontrado"
        return 1
    fi
    
    print_info "BACKEND: Compilando con Maven..."
    
    # Compilar
    MAVEN_OPTS=""
    if [ "$FAST_MODE" = true ]; then
        MAVEN_OPTS="-DskipTests -T $(nproc) --offline"
    else
        MAVEN_OPTS="-DskipTests"
    fi
    if ! mvn clean package $MAVEN_OPTS 2>&1 | tee "$BACKEND_LOG"; then
        print_error "BACKEND: Error compilando"
        return 1
    fi
    
    print_success "BACKEND: Compilación completada"
    print_info "BACKEND: Iniciando Spring Boot en puerto $BACKEND_PORT..."
    
    # Ejecutar JAR
    java -jar target/workable-0.0.1-SNAPSHOT.jar 2>&1 | tee "$BACKEND_LOG"
    
    # Si llega aquí, se presionó Ctrl+C
    print_warning "BACKEND: Detenido"
}

run_frontend() {
    print_info "FRONTEND: Iniciando..."
    
    if ! ensure_frontend_dependencies; then
        return 1
    fi

    cd "$FRONTEND_DIR"
    
    print_info "FRONTEND: Iniciando Vite en puerto $FRONTEND_PORT..."
    
    # Ejecutar
    npm run dev -- --host 0.0.0.0 2>&1 | tee "$FRONTEND_LOG"
    
    # Si llega aquí, se presionó Ctrl+C
    print_warning "FRONTEND: Detenido"
}

run_backend_background() {
    print_info "BACKEND: Compilando e iniciando en background..."
    
    # Asegurar que MySQL está corriendo
    if ! ensure_mysql_running; then
        print_error "BACKEND: No se puede iniciar sin database"
        return 1
    fi
    
    cd "$BACKEND_DIR"
    
    print_info "BACKEND: Compilando..."
    
    # Compilar
    MAVEN_OPTS="-q"
    if [ "$FAST_MODE" = true ]; then
        MAVEN_OPTS="$MAVEN_OPTS -DskipTests -T $(nproc) --offline"
    else
        MAVEN_OPTS="$MAVEN_OPTS -DskipTests"
    fi
    if ! mvn clean package $MAVEN_OPTS 2>&1 | tee -a "$BACKEND_LOG"; then
        print_error "BACKEND: Error compilando"
        return 1
    fi
    
    # Verificar que el JAR se creó
    if [ ! -f "target/workable-0.0.1-SNAPSHOT.jar" ]; then
        print_error "BACKEND: JAR no creado"
        return 1
    fi
    
    print_success "BACKEND: JAR listo"
    
    # Verificar que no hay procesos previos
    kill_port_process $BACKEND_PORT
    sleep 1
    
    # Ejecutar el JAR en background
    print_info "BACKEND: Iniciando..."
    java -jar target/workable-0.0.1-SNAPSHOT.jar > "$BACKEND_LOG" 2>&1 &
    
    local backend_pid=$!
    echo $backend_pid > "$BACKEND_PID_FILE"
    
    print_success "BACKEND: Iniciado (PID: $backend_pid)"
    
    # Health check
    sleep 2
    if check_backend_health; then
        print_success "BACKEND: Listo"
        return 0
    else
        print_error "BACKEND: No responde"
        return 1
    fi
}

run_frontend_background() {
    print_info "FRONTEND: Instalando e iniciando en background..."
    
    if ! ensure_frontend_dependencies; then
        return 1
    fi

    cd "$FRONTEND_DIR"
    
    # Verificar que no hay procesos previos
    kill_port_process $FRONTEND_PORT
    sleep 1
    
    # Ejecutar en background
    print_info "FRONTEND: Iniciando..."
    npm run dev -- --host 0.0.0.0 > "$FRONTEND_LOG" 2>&1 &
    
    local frontend_pid=$!
    echo $frontend_pid > "$FRONTEND_PID_FILE"
    
    print_success "FRONTEND: Iniciado (PID: $frontend_pid)"
    
    # Esperar a que Vite esté listo
    sleep 2
    
    if curl -s http://localhost:$FRONTEND_PORT > /dev/null 2>&1; then
        print_success "FRONTEND: Listo"
        return 0
    else
        print_warning "FRONTEND: Iniciando..."
        sleep 2
        return 0
    fi
}

run_both_parallel() {
    print_info "SYSTEM: Iniciando backend y frontend en paralelo..."
    
    # Limpieza
    force_kill_backend
    force_kill_frontend
    
    # Iniciar DB
    if ! ensure_mysql_running; then
        print_error "SYSTEM: No se puede iniciar sin DB"
        return 1
    fi
    
    # Paralelizar
    run_backend_background &
    BACKEND_JOB=$!
    run_frontend_background &
    FRONTEND_JOB=$!
    
    # Esperar
    wait $BACKEND_JOB
    BACKEND_EXIT=$?
    wait $FRONTEND_JOB
    FRONTEND_EXIT=$?
    
    if [ $BACKEND_EXIT -eq 0 ] && [ $FRONTEND_EXIT -eq 0 ]; then
        print_success "SYSTEM: Backend y frontend listos"
        echo -e "${BOLD}Acceso:${NC} Backend http://localhost:$BACKEND_PORT, Frontend http://localhost:$FRONTEND_PORT"
        return 0
    else
        print_error "SYSTEM: Error iniciando servicios"
        return 1
    fi
}

# ===== MENÚ PRINCIPAL =====

show_menu() {
    echo -e "${BLUE}"
    echo "========================================"
    echo "   MENU PRINCIPAL - WORKABLE"
    echo "========================================"
    echo -e "${NC}"
    echo ""
    echo -e "${GREEN}1)${NC} Verificar Dependencias"
    echo -e "${GREEN}2)${NC} Ejecutar Backend + Frontend (paralelo)"
    echo -e "${RED}3)${NC} Salir"
    echo ""
    echo "========================================"
}

restore_terminal() {
    sanitize_terminal
}

main_menu() {
    while true; do
        clear  # Limpiar la pantalla
        show_menu
        sanitize_terminal
        read -r -p "Selecciona una opción (1-3): " choice
        
        case $choice in
            1)
                clear
                check_dependencies
                sanitize_terminal
                read -r -p "Presiona Enter para continuar..."
                ;;
            2)
                clear
                print_header "INICIANDO BACKEND Y FRONTEND EN PARALELO"
                
                if ! run_both_parallel; then
                    print_error "Error iniciando servicios"
                    sanitize_terminal
                    read -r -p "Presiona Enter para continuar..."
                    continue
                fi
                
                sanitize_terminal
                read -r -p "Presiona Enter para volver al menú..."
                ;;
            3)
                clear
                print_header "DETENIENDO TODO"
                stop_all_processes
                echo ""
                print_success "¡Hasta luego!"
                exit 0
                ;;
            *)
                print_error "Opción no válida. Por favor selecciona 1-3."
                sleep 2
                ;;
        esac
    done
}

# ===== PUNTO DE ENTRADA =====

# Verificar si se ejecuta con argumentos
# Parsear argumentos globales
for arg in "$@"; do
    case $arg in
        --fast) FAST_MODE=true ;;
        --quiet) QUIET_MODE=true ;;
        --parallel) PARALLEL_MODE=true ;;
    esac
done

if [ "$1" == "--backend-only" ]; then
    check_dependencies || exit 1
    validate_project_structure || exit 1
    run_backend
elif [ "$1" == "--frontend-only" ]; then
    check_dependencies || exit 1
    validate_project_structure || exit 1
    run_frontend
elif [ "$1" == "--backend-bg" ]; then
    check_dependencies || exit 1
    validate_project_structure || exit 1
    run_backend_background || exit 1
    print_info "Backend en background. Para detener: kill $(cat $BACKEND_PID_FILE)"
    sleep 99999
elif [ "$1" == "--frontend-bg" ]; then
    check_dependencies || exit 1
    validate_project_structure || exit 1
    run_frontend_background || exit 1
    print_info "Frontend en background. Para detener: kill $(cat $FRONTEND_PID_FILE)"
    sleep 99999
elif [ "$PARALLEL_MODE" = true ]; then
    check_dependencies || exit 1
    validate_project_structure || exit 1
    run_both_parallel || exit 1
    sleep 99999
else
    # Modo menú interactivo
    check_dependencies || exit 1
    validate_project_structure || exit 1
    main_menu
fi
