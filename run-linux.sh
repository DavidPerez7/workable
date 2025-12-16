#!/bin/bash

# Script principal para ejecutar el proyecto Workable (Backend + Frontend)
# Proporciona opciones para ejecutar backend, frontend o ambos en terminales separadas
# Mejorado con: error handling robusto, logging detallado, health checks

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Rutas relativas
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

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

# ===== FUNCIONES AUXILIARES =====

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}   $1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ $1${NC}"
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
    print_header "Verificando Dependencias"
    
    local deps_ok=true
    
    # Verificar Node.js y npm
    if ! check_command "node"; then
        print_error "Node.js no está instalado o no está en PATH"
        deps_ok=false
    else
        print_success "Node.js encontrado: $(node --version)"
    fi
    
    if ! check_command "npm"; then
        print_error "npm no está instalado o no está en PATH"
        deps_ok=false
    else
        print_success "npm encontrado: $(npm --version)"
    fi
    
    # Verificar Java y Maven
    if ! check_command "java"; then
        print_error "Java no está instalado o no está en PATH"
        deps_ok=false
    else
        print_success "Java encontrado: $(java -version 2>&1 | head -n 1)"
    fi
    
    if ! check_command "mvn"; then
        print_error "Maven no está instalado o no está en PATH"
        deps_ok=false
    else
        print_success "Maven encontrado: $(mvn --version | head -n 1)"
    fi
    
    if [ "$deps_ok" = false ]; then
        print_error "Faltan algunas dependencias. Instálalas e intenta de nuevo."
        return 1
    fi
    
    print_success "Todas las dependencias están disponibles"
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
    print_info "Limpieza agresiva de procesos del backend..."
    local killed=false
    
    # 1. Terminar por PID guardado
    if [ -f "$BACKEND_PID_FILE" ]; then
        local backend_pid=$(cat "$BACKEND_PID_FILE")
        if kill -0 $backend_pid 2>/dev/null; then
            kill -9 $backend_pid 2>/dev/null || true
            print_success "Backend detenido (PID: $backend_pid)"
            killed=true
        fi
        rm -f "$BACKEND_PID_FILE"
    fi
    
    # 2. Terminar procesos Java que contengan "workable"
    if pgrep -f "workable.*\.jar" > /dev/null 2>&1; then
        local java_pids=$(pgrep -f "workable.*\.jar")
        for pid in $java_pids; do
            kill -9 $pid 2>/dev/null || true
            print_success "Proceso Java workable terminado (PID: $pid)"
            killed=true
        done
    fi
    
    # 3. Terminar procesos en puerto 8080
    if command -v lsof &> /dev/null; then
        if lsof -ti :$BACKEND_PORT > /dev/null 2>&1; then
            local port_pids=$(lsof -ti :$BACKEND_PORT)
            for pid in $port_pids; do
                kill -9 $pid 2>/dev/null || true
                print_success "Proceso en puerto $BACKEND_PORT terminado (PID: $pid)"
                killed=true
            done
        fi
    fi
    
    # 4. Fallback: matar todos los procesos Java
    if pgrep java > /dev/null 2>&1; then
        pkill -9 java 2>/dev/null || true
        print_success "Todos los procesos Java terminados"
        killed=true
    fi
    
    if [ "$killed" = false ]; then
        print_info "No hay procesos del backend en ejecución"
    fi
    
    # Esperar a que los puertos se liberen
    sleep 2
}

# Limpieza agresiva de procesos del frontend
force_kill_frontend() {
    print_info "Limpieza agresiva de procesos del frontend..."
    local killed=false
    
    # 1. Terminar por PID guardado
    if [ -f "$FRONTEND_PID_FILE" ]; then
        local frontend_pid=$(cat "$FRONTEND_PID_FILE")
        if kill -0 $frontend_pid 2>/dev/null; then
            kill -9 $frontend_pid 2>/dev/null || true
            print_success "Frontend detenido (PID: $frontend_pid)"
            killed=true
        fi
        rm -f "$FRONTEND_PID_FILE"
    fi
    
    # 2. Terminar procesos Vite/Node que contengan "vite" o puerto 5173
    if pgrep -f "vite" > /dev/null 2>&1; then
        local vite_pids=$(pgrep -f "vite")
        for pid in $vite_pids; do
            kill -9 $pid 2>/dev/null || true
            print_success "Proceso Vite terminado (PID: $pid)"
            killed=true
        done
    fi
    
    # 3. Terminar procesos en puerto 5173
    if command -v lsof &> /dev/null; then
        if lsof -ti :$FRONTEND_PORT > /dev/null 2>&1; then
            local port_pids=$(lsof -ti :$FRONTEND_PORT)
            for pid in $port_pids; do
                kill -9 $pid 2>/dev/null || true
                print_success "Proceso en puerto $FRONTEND_PORT terminado (PID: $pid)"
                killed=true
            done
        fi
    fi
    
    # 4. Terminar procesos Node relacionados con el frontend
    if pgrep -f "node.*frontend" > /dev/null 2>&1; then
        local node_pids=$(pgrep -f "node.*frontend")
        for pid in $node_pids; do
            kill -9 $pid 2>/dev/null || true
            print_success "Proceso Node frontend terminado (PID: $pid)"
            killed=true
        done
    fi
    
    # 5. Fallback: matar todos los procesos Node
    if pgrep node > /dev/null 2>&1; then
        pkill -9 node 2>/dev/null || true
        print_success "Todos los procesos Node terminados"
        killed=true
    fi
    
    if [ "$killed" = false ]; then
        print_info "No hay procesos del frontend en ejecución"
    fi
    
    # Esperar a que los puertos se liberen
    sleep 2
}

# Verificar y iniciar MySQL (XAMPP)
ensure_mysql_running() {
    print_header "Verificando MySQL"
    
    if pgrep -x "mysqld" > /dev/null; then
        print_success "MySQL ya está corriendo"
        sleep 2
        return 0
    fi
    
    print_warning "MySQL no está corriendo. Intentando iniciar XAMPP..."
    
    # Intentar diferentes ubicaciones de XAMPP
    local xampp_paths=(
        "/opt/lampp/lampp"
        "/home/*/lampp/lampp"
        "$HOME/lampp/lampp"
        "$HOME/.local/lampp/lampp"
    )
    
    for xampp_path in "${xampp_paths[@]}"; do
        if [ -f "$xampp_path" ]; then
            print_info "Encontrado XAMPP en: $xampp_path"
            
            # Dar permisos de ejecución si es necesario
            chmod +x "$xampp_path" 2>/dev/null || true
            
            print_info "Iniciando XAMPP..."
            if sudo "$xampp_path" start 2>&1 | tee -a "$HEALTH_CHECK_LOG"; then
                print_success "XAMPP iniciado correctamente"
                print_warning "Esperando 15 segundos para que MySQL esté listo..."
                sleep 15
                
                # Verificar que MySQL está realmente corriendo
                if pgrep -x "mysqld" > /dev/null; then
                    print_success "MySQL verificado y corriendo"
                    return 0
                else
                    print_error "MySQL no responde después de iniciar XAMPP"
                    return 1
                fi
            else
                print_warning "XAMPP no se inició correctamente con: $xampp_path"
            fi
        fi
    done
    
    # Si no se encontró XAMPP, intentar iniciar mysqld directamente
    print_warning "XAMPP no encontrado. Intentando iniciar mysqld directamente..."
    if command -v mysqld &> /dev/null; then
        # Usar systemctl si está disponible
        if command -v systemctl &> /dev/null; then
            print_info "Intentando iniciar MySQL con systemctl..."
            if sudo systemctl start mysql 2>&1 | tee -a "$HEALTH_CHECK_LOG"; then
                print_success "MySQL iniciado con systemctl"
                sleep 5
                return 0
            elif sudo systemctl start mariadb 2>&1 | tee -a "$HEALTH_CHECK_LOG"; then
                print_success "MariaDB iniciado con systemctl"
                sleep 5
                return 0
            fi
        fi
    fi
    
    print_error "No se pudo iniciar MySQL. Asegúrate de que:"
    echo "  1. XAMPP esté instalado en /opt/lampp"
    echo "  2. O MySQL/MariaDB esté instalado y disponible en PATH"
    echo "  3. O puedas ejecutar 'sudo systemctl start mysql'"
    return 1
}

# Health check para el backend
check_backend_health() {
    local max_attempts=30
    local attempt=1
    
    print_info "Realizando health check del backend (máximo ${max_attempts} intentos)..."
    
    while [ $attempt -le $max_attempts ]; do
        # Verificar si el puerto está escuchando Y si el endpoint responde
        if netstat -tuln 2>/dev/null | grep -q ":$BACKEND_PORT " || ss -tuln 2>/dev/null | grep -q ":$BACKEND_PORT "; then
            # Puerto abierto, ahora verificar que responde
            if curl -s http://localhost:$BACKEND_PORT/api/municipio > /dev/null 2>&1; then
                print_success "Backend está respondiendo en http://localhost:$BACKEND_PORT"
                return 0
            fi
        fi
        
        if [ $((attempt % 5)) -eq 0 ]; then
            print_info "Esperando backend... intento $attempt/$max_attempts"
        fi
        
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "Backend no está respondiendo después de ${max_attempts} intentos"
    print_error "Revisa los logs: tail -f $BACKEND_LOG"
    return 1
}

# Validar que existen los directorios y archivos necesarios
validate_project_structure() {
    print_header "Validando Estructura del Proyecto"
    
    if [ ! -d "$BACKEND_DIR" ]; then
        print_error "Directorio backend no encontrado: $BACKEND_DIR"
        return 1
    fi
    print_success "Directorio backend encontrado"
    
    if [ ! -f "$BACKEND_DIR/pom.xml" ]; then
        print_error "pom.xml no encontrado en backend"
        return 1
    fi
    print_success "pom.xml encontrado"
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        print_error "Directorio frontend no encontrado: $FRONTEND_DIR"
        return 1
    fi
    print_success "Directorio frontend encontrado"
    
    if [ ! -f "$FRONTEND_DIR/package.json" ]; then
        print_error "package.json no encontrado en frontend"
        return 1
    fi
    print_success "package.json encontrado"
    
    return 0
}

# Detener procesos del proyecto
stop_all_processes() {
    print_header "DETENIENDO PROCESOS"
    
    local stopped=false
    
    # Detener backend si existe el PID guardado
    if [ -f "$BACKEND_PID_FILE" ]; then
        local backend_pid=$(cat "$BACKEND_PID_FILE")
        if kill -0 $backend_pid 2>/dev/null; then
            kill -9 $backend_pid 2>/dev/null || true
            print_success "Backend (PID $backend_pid) detenido"
            stopped=true
        fi
        rm -f "$BACKEND_PID_FILE"
    fi
    
    # Detener frontend si existe el PID guardado
    if [ -f "$FRONTEND_PID_FILE" ]; then
        local frontend_pid=$(cat "$FRONTEND_PID_FILE")
        if kill -0 $frontend_pid 2>/dev/null; then
            kill -9 $frontend_pid 2>/dev/null || true
            print_success "Frontend (PID $frontend_pid) detenido"
            stopped=true
        fi
        rm -f "$FRONTEND_PID_FILE"
    fi
    
    # Matar todos los procesos java y node como alternativa
    if pgrep java > /dev/null; then
        pkill -9 java 2>/dev/null || true
        print_success "Procesos Java detenidos"
        stopped=true
    fi
    
    if pgrep node > /dev/null; then
        pkill -9 node 2>/dev/null || true
        print_success "Procesos Node.js detenidos"
        stopped=true
    fi
    
    sleep 1
    
    if [ "$stopped" = true ]; then
        print_success "✓ Todos los procesos han sido detenidos correctamente"
    else
        print_warning "⚠ No hay procesos en ejecución"
    fi
}

# ===== FUNCIONES PRINCIPALES =====

run_backend() {
    print_header "INICIANDO BACKEND (Spring Boot)"
    
    # Asegurar que MySQL está corriendo
    if ! ensure_mysql_running; then
        print_error "No se puede iniciar el backend sin MySQL"
        return 1
    fi
    
    cd "$BACKEND_DIR"
    
    if [ ! -f "pom.xml" ]; then
        print_error "No se encuentra pom.xml en $BACKEND_DIR"
        return 1
    fi
    
    print_success "Compilando proyecto Backend con Maven..."
    print_warning "Esto puede tomar algunos minutos la primera vez..."
    
    # Compilar
    if ! mvn clean package -DskipTests 2>&1 | tee "$BACKEND_LOG"; then
        print_error "Error compilando el backend. Revisa el log: $BACKEND_LOG"
        return 1
    fi
    
    print_success "Compilación completada"
    print_success "Iniciando Spring Boot en puerto $BACKEND_PORT..."
    echo -e "${YELLOW}Presiona Ctrl+C para detener el backend${NC}"
    
    # Ejecutar JAR
    java -jar target/workable-0.0.1-SNAPSHOT.jar 2>&1 | tee "$BACKEND_LOG"
    
    # Si llega aquí, se presionó Ctrl+C
    print_warning "Backend detenido"
}

run_frontend() {
    print_header "INICIANDO FRONTEND (Vite)"
    
    cd "$FRONTEND_DIR"
    
    if [ ! -f "package.json" ]; then
        print_error "No se encuentra package.json en $FRONTEND_DIR"
        return 1
    fi
    
    # Verificar si node_modules existe
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules no encontrado. Instalando dependencias..."
        if ! npm install 2>&1 | tee "$FRONTEND_LOG"; then
            print_error "Error instalando dependencias de frontend"
            return 1
        fi
    fi
    
    print_success "Iniciando Vite en puerto $FRONTEND_PORT..."
    echo -e "${YELLOW}Presiona Ctrl+C para detener el frontend${NC}"
    
    # Ejecutar
    npm run dev 2>&1 | tee "$FRONTEND_LOG"
    
    # Si llega aquí, se presionó Ctrl+C
    print_warning "Frontend detenido"
}

run_backend_background() {
    print_header "COMPILANDO E INICIANDO BACKEND EN BACKGROUND"
    
    # Asegurar que MySQL está corriendo
    if ! ensure_mysql_running; then
        print_error "No se puede iniciar el backend sin MySQL"
        return 1
    fi
    
    cd "$BACKEND_DIR"
    
    print_success "Compilando Backend..."
    
    # Compilar
    if ! mvn clean package -DskipTests -q 2>&1 | tee -a "$BACKEND_LOG"; then
        print_error "Error compilando backend"
        print_error "Revisa: $BACKEND_LOG"
        return 1
    fi
    
    # Verificar que el JAR se creó
    if [ ! -f "target/workable-0.0.1-SNAPSHOT.jar" ]; then
        print_error "JAR no fue creado después de la compilación"
        return 1
    fi
    
    print_success "JAR compilado exitosamente"
    
    # Verificar que no hay procesos previos
    print_info "Verificando que no hay procesos previos del backend..."
    kill_port_process $BACKEND_PORT
    sleep 1
    
    # Ejecutar el JAR en background
    print_info "Iniciando Spring Boot..."
    java -jar target/workable-0.0.1-SNAPSHOT.jar > "$BACKEND_LOG" 2>&1 &
    
    local backend_pid=$!
    echo $backend_pid > "$BACKEND_PID_FILE"
    
    print_success "Backend iniciado (PID: $backend_pid)"
    
    # Health check
    sleep 3
    if check_backend_health; then
        print_success "✓ Backend está listo"
        return 0
    else
        print_error "Backend no está respondiendo"
        print_error "PID: $backend_pid"
        print_error "Log: tail -f $BACKEND_LOG"
        return 1
    fi
run_frontend_background() {
    print_header "INSTALANDO E INICIANDO FRONTEND EN BACKGROUND"
    
    cd "$FRONTEND_DIR"
    
    # Verificar si node_modules existe
    if [ ! -d "node_modules" ]; then
        print_warning "Instalando dependencias de Frontend..."
        if ! npm install --legacy-peer-deps -q 2>&1 | tee -a "$FRONTEND_LOG"; then
            print_error "Error instalando dependencias de frontend"
            return 1
        fi
    fi
    
    # Verificar que no hay procesos previos
    print_info "Verificando que no hay procesos previos del frontend..."
    kill_port_process $FRONTEND_PORT
    sleep 1
    # Limpiar puerto
    kill_port_process $FRONTEND_PORT
    
    # Ejecutar en background
    print_info "Iniciando Vite..."
    npm run dev > "$FRONTEND_LOG" 2>&1 &
    
    local frontend_pid=$!
    echo $frontend_pid > "$FRONTEND_PID_FILE"
    
    print_success "Frontend iniciado (PID: $frontend_pid)"
    
    # Esperar a que Vite esté listo
    sleep 3
    
    if curl -s http://localhost:$FRONTEND_PORT > /dev/null 2>&1; then
        print_success "✓ Frontend está listo"
        return 0
    else
        print_warning "Frontend está iniciando, puede tomar algunos segundos..."
        sleep 3
        return 0
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
    echo -e "${GREEN}1)${NC} Ejecutar SOLO Backend (foreground)"
    echo -e "${GREEN}2)${NC} Ejecutar SOLO Frontend (foreground)"
    echo -e "${GREEN}3)${NC} Ejecutar Backend + Frontend (background)"
    echo -e "${GREEN}4)${NC} Verificar Dependencias"
    echo -e "${GREEN}5)${NC} Validar Estructura del Proyecto"
    echo -e "${GREEN}6)${NC} Ver Logs"
    echo -e "${RED}7)${NC} Detener Todos los Procesos"
    echo -e "${RED}8)${NC} Salir"
    echo ""
    echo "========================================"
}

show_logs_menu() {
    echo -e "\n${BLUE}MENU DE LOGS${NC}"
    echo "1) Ver log Backend"
    echo "2) Ver log Frontend"
    echo "3) Seguir log Backend (tail -f)"
    echo "4) Seguir log Frontend (tail -f)"
    echo "5) Volver al menú"
    echo ""
    read -p "Selecciona una opción: " log_choice
    
    case $log_choice in
        1)
            if [ -f "$BACKEND_LOG" ]; then
                less "$BACKEND_LOG"
            else
                print_error "Log del backend no encontrado"
                sleep 2
            fi
            ;;
        2)
            if [ -f "$FRONTEND_LOG" ]; then
                less "$FRONTEND_LOG"
            else
                print_error "Log del frontend no encontrado"
                sleep 2
            fi
            ;;
        3)
            if [ -f "$BACKEND_LOG" ]; then
                print_info "Siguiendo log del backend (Ctrl+C para salir)..."
                tail -f "$BACKEND_LOG"
            else
                print_error "Log del backend no encontrado"
                sleep 2
            fi
            ;;
        4)
            if [ -f "$FRONTEND_LOG" ]; then
                print_info "Siguiendo log del frontend (Ctrl+C para salir)..."
                tail -f "$FRONTEND_LOG"
            else
                print_error "Log del frontend no encontrado"
                sleep 2
            fi
            ;;
        5)
            return 0
            ;;
        *)
            print_error "Opción no válida"
            sleep 2
            ;;
    esac
}

main_menu() {
    while true; do
        clear  # Limpiar la pantalla
        show_menu
        read -p "Selecciona una opción (1-8): " choice
        
        case $choice in
            1)
                clear
                run_backend
                read -p "Presiona Enter para continuar..."
                ;;
            2)
                clear
                run_frontend
                read -p "Presiona Enter para continuar..."
                ;;
            3)
                clear
                print_header "INICIANDO BACKEND Y FRONTEND EN BACKGROUND"
                
                # Limpieza agresiva de procesos existentes
                print_header "LIMPIEZA DE PROCESOS EXISTENTES"
                force_kill_backend
                force_kill_frontend
                
                print_success "✓ Limpieza completada"
                echo ""
                
                if ! run_backend_background; then
                    print_error "No se pudo iniciar backend"
                    read -p "Presiona Enter para continuar..."
                    continue
                fi
                
                if ! run_frontend_background; then
                    print_error "No se pudo iniciar frontend"
                    read -p "Presiona Enter para continuar..."
                    continue
                fi
                
                print_success "✓ Backend y Frontend iniciados en background"
                echo ""
                echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
                echo -e "${GREEN}✓ ACCESO A APLICACIONES:${NC}"
                echo "  Backend:  http://localhost:8080"
                echo "  Frontend: http://localhost:5173"
                echo ""
                echo -e "${YELLOW}📊 MONITOREAR EJECUCIÓN:${NC}"
                echo "  Backend:  tail -f $BACKEND_LOG"
                echo "  Frontend: tail -f $FRONTEND_LOG"
                echo ""
                echo -e "${RED}🛑 PARA DETENER TODO:${NC}"
                echo "  Presiona Ctrl+C aquí o selecciona opción 7 en el menú"
                echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}"
                read -p "Presiona Enter para volver al menú..."
                ;;
            4)
                clear
                check_dependencies
                read -p "Presiona Enter para continuar..."
                ;;
            5)
                clear
                validate_project_structure
                read -p "Presiona Enter para continuar..."
                ;;
            6)
                clear
                show_logs_menu
                ;;
            7)
                clear
                stop_all_processes
                sleep 2
                ;;
            8)
                clear
                print_header "DETENIENDO TODO"
                stop_all_processes
                echo ""
                print_success "¡Hasta luego!"
                exit 0
                ;;
            *)
                print_error "Opción no válida. Por favor selecciona 1-8."
                sleep 2
                ;;
        esac
    done
}

# ===== PUNTO DE ENTRADA =====

# Verificar si se ejecuta con argumentos
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
elif [ "$1" == "--both" ]; then
    check_dependencies || exit 1
    validate_project_structure || exit 1
    run_backend_background || exit 1
    run_frontend_background || exit 1
    echo -e "\n${GREEN}✓ Backend en puerto $BACKEND_PORT${NC}"
    echo -e "${GREEN}✓ Frontend en puerto $FRONTEND_PORT${NC}"
    sleep 99999
else
    # Modo menú interactivo
    check_dependencies || exit 1
    validate_project_structure || exit 1
    main_menu
fi
