#pragma once

#include <string>

#include "json.hpp"

const std::string SECTION_NAME_PREFIX = "opengloves.";

int GetSettings(nlohmann::json& json);
int SetSettings(const nlohmann::json& json);
int AutoCalibrate(const nlohmann::json& json);

int main();

