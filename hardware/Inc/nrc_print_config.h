#ifndef nrc_print_conf_h
#define nrc_print_conf_h

// если этот макрос == 1, то логи фильтруются программно глобальной переменной logLevelGlobal
//#define NRC_LOG_LEVEL_DYNAMIC 1

// следующие макросы позволяют фильтровать логи на уровне компиляции
// это особенно полезно для контроллеров
//#define NRC_LOG_LEVEL NRC_LOG_DISABLED
//#define NRC_LOG_LEVEL NRC_LOG_LEVEL_DEFAULT
//#define NRC_LOG_LEVEL NRC_LOG_LEVEL_DEBUG
#define NRC_LOG_LEVEL NRC_LOG_LEVEL_VERBATIM

// unbuffered stdout, call fflush(stdout) after each printf(...) call
//#define NRC_LOG_NEED_FFLUSH

#endif // nrc_print_conf_h

