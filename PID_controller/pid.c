#include "pid.h"
#include <stdint.h> // uint8_t, uint16_t

typedef struct PID_DATA {
	int16_t lastProcessValue;
	int32_t integralTerm;
	double kp;
	double ki;
	double kd;
	int16_t MAX_OUT;
	int16_t MIN_OUT;
} pidData_t;

struct PID_DATA pidData;

double pid_Controller(int16_t setPoint, int16_t processValue)
{
	double error, p_term, d_term;
	double out;

	error = setPoint - processValue;
	pidData.integralTerm += pidData.ki * error;
	if (pidData.integralTerm > pidData.MAX_OUT) {
		pidData.integralTerm = pidData.MAX_OUT;
		out = pidData.MAX_OUT;
	}
	else {
		d_term = pidData.kd * (processValue - pidData.lastProcessValue);
		p_term = pidData.kp * error;
		out = (p_term + pidData.integralTerm - d_term);
		if (out > pidData.MAX_OUT) {
			out = pidData.MAX_OUT;
		}
		else if (out < pidData.MIN_OUT) {
			out = pidData.MIN_OUT;
		}
	}
	pidData.lastProcessValue = processValue;

	return out;
}
