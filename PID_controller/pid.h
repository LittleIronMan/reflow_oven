#ifndef pid_h
#define pid_h

typedef struct {
	float lastProcessValue;
	float integralErr;
	float Kp; // пропорциональный коэффициент регулятора
	float Ti;
	float Td;
} PID_Data;

float pidController(PID_Data* pd, float setPoint, float processValue, float deltaTime/* в секундах */);

#endif // pid_h
