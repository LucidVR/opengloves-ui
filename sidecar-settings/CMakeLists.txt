cmake_minimum_required (VERSION 3.8)

project("openglove_ui_sidecar")
set_property(GLOBAL PROPERTY USE_FOLDERS ON)

# Deps
set(OPENVR_INCLUDE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/libraries/openvr/headers")
set(JSON_INCLUDE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/libraries/nlohmann")
set(SIZEOF_VOIDP ${CMAKE_SIZEOF_VOID_P})

if(CMAKE_SIZEOF_VOID_P EQUAL 8)
    set(PROCESSOR_ARCH "64")
elseif(CMAKE_SIZEOF_VOID_P EQUAL 4)
    set(PROCESSOR_ARCH "32")
endif()

if(WIN32)
    set(PLATFORM_NAME "win")
elseif(UNIX AND NOT APPLE)
    set(PLATFORM_NAME "linux")
elseif(APPLE)
    set(PLATFORM_NAME "osx")
endif()

find_library(OPENVR_LIB openvr_api HINTS "${CMAKE_CURRENT_SOURCE_DIR}/libraries/openvr/lib/${PLATFORM_NAME}${PROCESSOR_ARCH}/" NO_DEFAULT_PATH )

# Add source to this project's executable.
add_executable (sidecar-x86_64-pc-windows-msvc "main.cpp" "main.h")

target_include_directories(sidecar-x86_64-pc-windows-msvc PUBLIC "${OPENVR_INCLUDE_DIR}" "${JSON_INCLUDE_DIR}")
target_link_libraries(sidecar-x86_64-pc-windows-msvc PUBLIC "${OPENVR_LIB}")

add_custom_command(TARGET sidecar-x86_64-pc-windows-msvc POST_BUILD
COMMAND ${CMAKE_COMMAND} -E copy_if_different
    "${PROJECT_SOURCE_DIR}/libraries/openvr/bin/win64/openvr_api.dll"
    $<TARGET_FILE_DIR:sidecar-x86_64-pc-windows-msvc>)