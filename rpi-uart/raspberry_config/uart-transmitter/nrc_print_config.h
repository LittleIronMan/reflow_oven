#ifndef nrc_print_conf_h
#define nrc_print_conf_h

// unbuffered stdout, call fflush(stdout) after each printf(...) call
#define NRC_LOG_NEED_FFLUSH

//#define NRC_LOG_LEVEL NRC_LOG_DISABLED
#define NRC_LOG_LEVEL NRC_LOG_LEVEL_DEFAULT
//#define NRC_LOG_LEVEL NRC_LOG_LEVEL_DEBUG
//#define NRC_LOG_LEVEL NRC_LOG_LEVEL_VERBATIM

#endif // nrc_print_conf_h
