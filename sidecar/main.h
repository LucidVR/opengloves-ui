#pragma once

#include "json.hpp"

int GetSettings(nlohmann::json& json);
int SetSettings(const nlohmann::json& json);
int AutoCalibrate(const nlohmann::json& json);

int main();
