#include "pid.h"
#include <stdint.h> // uint8_t, uint16_t


float pidController(PID_Data *pd, float setPoint, float processValue, float deltaTime/* в секундах */)
{
	float error, dErr, control;
	error = setPoint - processValue;
	pd->integralErr += error * deltaTime; // интеграл ошибки
	dErr = (processValue - pd->lastProcessValue) / deltaTime; // производная ошибки
	pd->lastProcessValue = processValue;

	// U = K * (Err + (1 / Ti) * Int + Td * dErr)  см. здесь: https://habr.com/ru/post/145991/ - замечательная статья
	control = pd->Kp * (error +
						pd->integralErr / pd->Ti +
						pd->Td * dErr);

	return control;
}
