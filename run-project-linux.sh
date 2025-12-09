#!/bin/bash

# Script principal para ejecutar el proyecto Workable (Backend + Frontend)
# Proporciona opciones para ejecutar backend, frontend o ambos en terminales separadas

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Rutas relativas
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Puertos
BACKEND_PORT=8080
FRONTEND_PORT=5173

# ===== FUNCIONES AUXILIARES =====

print_header() {
    echo -e "\n${BLUE}========================================"
    echo "   $1"
    echo "==========================================${NC}\n"
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

# Verificar si una herramienta está disponible
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 no está instalado o no está en PATH."
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
        deps_ok=false
    else
        print_success "Node.js encontrado: $(node --version)"
    fi
    
    if ! check_command "npm"; then
        deps_ok=false
    else
        print_success "npm encontrado: $(npm --version)"
    fi
    
    # Verificar Java y Maven
    if ! check_command "java"; then
        deps_ok=false
    else
        print_success "Java encontrado: $(java -version 2>&1 | head -n 1)"
    fi
    
    if ! check_command "mvn"; then
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
    
    if lsof -i :$port > /dev/null 2>&1; then
        print_warning "Puerto $port está en uso. Intentando liberar..."
        local pids=$(lsof -ti :$port)
        for pid in $pids; do
            kill -9 $pid 2>/dev/null
            print_success "Proceso PID $pid en puerto $port terminado"
        done
    fi
}

# Matar procesos de Vite
kill_vite_processes() {
    local vite_pids=$(ps aux | grep '[v]ite' | awk '{print $2}')
    
    if [ ! -z "$vite_pids" ]; then
        print_warning "Encontrados procesos de Vite. Terminando..."
        for pid in $vite_pids; do
            kill -9 $pid 2>/dev/null
            print_success "Proceso Vite PID $pid terminado"
        done
    fi
}

# Verificar y iniciar MySQL (XAMPP)
ensure_mysql_running() {
    if pgrep -x "mysqld" > /dev/null; then
        print_success "MySQL ya está corriendo"
        return 0
    fi
    
    print_warning "MySQL no está corriendo. Intentando iniciar XAMPP..."
    
    if [ -f "/opt/lampp/lampp" ]; then
        sudo /opt/lampp/lampp start
        if [ $? -eq 0 ]; then
            print_success "XAMPP iniciado correctamente"
            print_warning "Esperando 10 segundos para que MySQL esté listo..."
            sleep 10
            return 0
        else
            print_error "No se pudo iniciar XAMPP"
            return 1
        fi
    else
        print_error "No se encontró XAMPP en /opt/lampp/lampp"
        return 1
    fi
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
    if [ -f /tmp/workable-backend.pid ]; then
        local backend_pid=$(cat /tmp/workable-backend.pid)
        if kill -0 $backend_pid 2>/dev/null; then
            kill -9 $backend_pid 2>/dev/null
            print_success "Backend (PID $backend_pid) detenido"
            stopped=true
        fi
        rm -f /tmp/workable-backend.pid
    fi
    
    # Detener frontend si existe el PID guardado
    if [ -f /tmp/workable-frontend.pid ]; then
        local frontend_pid=$(cat /tmp/workable-frontend.pid)
        if kill -0 $frontend_pid 2>/dev/null; then
            kill -9 $frontend_pid 2>/dev/null
            print_success "Frontend (PID $frontend_pid) detenido"
            stopped=true
        fi
        rm -f /tmp/workable-frontend.pid
    fi
    
    # Matar todos los procesos java y node como alternativa
    if pgrep java > /dev/null; then
        pkill -9 java 2>/dev/null
        print_success "Procesos Java detenidos"
        stopped=true
    fi
    
    if pgrep node > /dev/null; then
        pkill -9 node 2>/dev/null
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
    
    if ! ensure_mysql_running; then
        print_error "No se puede iniciar el backend sin MySQL"
        return 1
    fi
    
    cd "$BACKEND_DIR"
    
    if [ ! -f "pom.xml" ]; then
        print_error "No se encuentra pom.xml en $BACKEND_DIR"
        return 1
    fi
    
    print_success "Iniciando Spring Boot en puerto $BACKEND_PORT..."
    echo -e "${YELLOW}Presiona Ctrl+C para detener el backend${NC}"
    
    # Ejecutar con manejo de señales
    mvn spring-boot:run
    
    # Si llega aquí, se presionó Ctrl+C
    print_warning "Backend detenido"
}

run_frontend() {
    print_header "INICIANDO FRONTEND (Vite)"
    
    # Limpiar procesos previos
    kill_vite_processes
    kill_port_process $FRONTEND_PORT
    
    cd "$FRONTEND_DIR"
    
    if [ ! -f "package.json" ]; then
        print_error "No se encuentra package.json en $FRONTEND_DIR"
        return 1
    fi
    
    # Verificar si node_modules existe
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules no encontrado. Instalando dependencias..."
        npm install
        if [ $? -ne 0 ]; then
            print_error "Error instalando dependencias de frontend"
            return 1
        fi
    fi
    
    print_success "Iniciando Vite en puerto $FRONTEND_PORT..."
    echo -e "${YELLOW}Presiona Ctrl+C para detener el frontend${NC}"
    
    # Ejecutar con manejo de señales
    npm run dev
    
    # Si llega aquí, se presionó Ctrl+C
    print_warning "Frontend detenido"
}

run_backend_in_new_terminal() {
    print_success "Compilando y iniciando Backend en background..."
    
    cd "$BACKEND_DIR"
    
    # Compilar si es necesario
    if [ ! -f "target/workable-0.0.1-SNAPSHOT.jar" ]; then
        print_warning "JAR no encontrado. Compilando..."
        mvn clean package -DskipTests -q
    fi
    
    # Ejecutar el JAR directamente (más eficiente que mvn spring-boot:run)
    java -jar target/workable-0.0.1-SNAPSHOT.jar > /tmp/workable-backend.log 2>&1 &
    
    if [ $? -eq 0 ]; then
        echo $! > /tmp/workable-backend.pid
        sleep 3
        print_success "Backend iniciado (PID: $(cat /tmp/workable-backend.pid))"
        print_warning "Log: tail -f /tmp/workable-backend.log"
        return 0
    else
        print_error "Error al iniciar backend"
        return 1
    fi
}

run_frontend_in_new_terminal() {
    print_success "Iniciando Frontend en background..."
    
    cd "$FRONTEND_DIR"
    
    # Verificar si node_modules existe
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules no encontrado. Instalando dependencias..."
        npm install --legacy-peer-deps -q
    fi
    
    # Ejecutar en background
    npm run dev > /tmp/workable-frontend.log 2>&1 &
    
    if [ $? -eq 0 ]; then
        echo $! > /tmp/workable-frontend.pid
        sleep 2
        print_success "Frontend iniciado (PID: $(cat /tmp/workable-frontend.pid))"
        print_warning "Log: tail -f /tmp/workable-frontend.log"
        return 0
    else
        print_error "Error al iniciar frontend"
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
    echo -e "${GREEN}1)${NC} Ejecutar SOLO Backend"
    echo -e "${GREEN}2)${NC} Ejecutar SOLO Frontend"
    echo -e "${GREEN}3)${NC} Ejecutar Backend + Frontend (en background)"
    echo -e "${GREEN}4)${NC} Verificar Dependencias"
    echo -e "${GREEN}5)${NC} Validar Estructura del Proyecto"
    echo -e "${RED}6)${NC} Detener Todos los Procesos"
    echo -e "${RED}7)${NC} Salir"
    echo ""
    echo "========================================"
}

main_menu() {
    while true; do
        clear  # Limpiar la pantalla
        show_menu
        read -p "Selecciona una opción (1-7): " choice
        
        case $choice in
            1)
                run_backend
                ;;
            2)
                run_frontend
                ;;
            3)
                clear
                print_header "INICIANDO BACKEND Y FRONTEND EN BACKGROUND"
                
                if ! run_backend_in_new_terminal; then
                    print_error "No se pudo iniciar backend"
                    read -p "Presiona Enter para continuar..."
                    continue
                fi
                
                if ! run_frontend_in_new_terminal; then
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
                echo "  Backend:  tail -f /tmp/workable-backend.log"
                echo "  Frontend: tail -f /tmp/workable-frontend.log"
                echo ""
                echo -e "${RED}🛑 PARA DETENER TODO:${NC}"
                echo "  Vuelve al menú y selecciona opción 6"
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
                stop_all_processes
                sleep 2
                ;;
            7)
                clear
                print_header "DETENIENDO TODO"
                stop_all_processes
                echo ""
                print_success "¡Hasta luego!"
                exit 0
                ;;
            *)
                print_error "Opción no válida. Por favor selecciona 1-7."
                sleep 2
                ;;
        esac
    done
}

# ===== PUNTO DE ENTRADA =====

# Manejar argumentos de línea de comandos para ejecución sin menú
if [ "$1" == "--backend-only" ]; then
    check_dependencies || exit 1
    validate_project_structure || exit 1
    run_backend
elif [ "$1" == "--frontend-only" ]; then
    check_dependencies || exit 1
    validate_project_structure || exit 1
    run_frontend
else
    # Modo menú interactivo
    check_dependencies || exit 1
    validate_project_structure || exit 1
    main_menu
fi
