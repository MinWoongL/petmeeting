#define F_CPU 16588800

#define MAX_ITERATION 8000

#include <avr/io.h>
#include <util/delay.h>
#include <avr/interrupt.h>

#define FOSC 16588800// Clock Speed
#define BAUD 115200
#define MYUBRR FOSC/16/BAUD-1

// USART IO

void USART1_Init( unsigned int ubrr );
void USART1_Transmit( char data );
unsigned char USART1_Receive( void );
unsigned char USART1_Receive_Bound( char data );

void USART1_Transmit_String( char * string );

unsigned int Get_String_Length( char * string );

// motor
void processCommand(unsigned char cmd);
int opened = 0;

// PWM
#define BASE_MS 1500
#define OPEN_MS 3500
void Init_PWM();

// Interrupt
volatile unsigned char last_char = 0;

ISR(USART1_RX_vect)
{
	last_char = UDR1;
}



int main( void )
{
	char str_pre[5][100] = {
		"AT+RST\r\n",
		"AT+CWMODE=3\r\n",
		"AT+CWJAP=\"i9a203\",\"12345678\"\r\n",
		"AT+CIPSTART=\"TCP\",\"i9a203.p.ssafy.io\",3010\r\n",
		"AT+CIPMODE=0\r\n"
	};
	char str_main[2][200] = {
		"AT+CIPSEND=78\r\n",
		"GET /iot/1d HTTP/1.1\r\nHost: i9a203.p.ssafy.io:3010\r\nConnection: keep-alive\r\n\r\n"
	};
	
	// initialization
	cli();
	USART0_Init ( MYUBRR );
	USART1_Init ( MYUBRR );
	Init_PWM();
	sei();
	
	
	// run AT command
	
	for(int string_no = 0; string_no < 5; ++string_no) {
		USART1_Transmit_String(str_pre[string_no]);
		
		//while(last_char != 'K') {};
		_delay_ms(7000);
	}
	
	while(1)
	{
		USART1_Transmit_String(str_main[0]);
		
		_delay_ms(30);
		
		USART1_Transmit_String(str_main[1]);
		
		_delay_ms(500);
		
		processCommand(last_char);
	}
	return(0);
}

// USART

void USART1_Init( unsigned int ubrr )
{
	/* Set baud rate */
	UBRR1H = (unsigned char)(ubrr>>8);
	UBRR1L = (unsigned char)ubrr;
	/* Enable receiver and transmitter */
	UCSR1B = (1<<RXCIE1)|(1<<RXEN1)|(1<<TXEN1);
	/* Set frame format: 8data, 2stop bit */
	UCSR1C = (1<<USBS1)|(3<<UCSZ0);
}

void USART1_Transmit( char data )
{
	/* Wait for empty transmit buffer */
	while ( !( UCSR1A & (1<<UDRE1)) )
	;
	/* Put data into buffer, sends the data */
	UDR1 = data;
}

unsigned char USART1_Receive( void )
{
	/* Wait for data to be received */
	while ( !(UCSR1A & (1<<RXC)) )
	;
	/* Get and return received data from buffer */
	return UDR1;
}

unsigned char USART1_Receive_Bound( char data )
{
	/* Wait for data to be received */
	int i = 0;
	while ( !(UCSR1A & (1<<RXC)) && ++i < MAX_ITERATION)
	;
	
	if(MAX_ITERATION <= i) {return data;}
	/* Get and return received data from buffer */
	return UDR1;
}

void USART1_Transmit_String( char * string )
{
	/* Transmit data to USART1 */
	unsigned int i = 0;
	const unsigned int string_length = Get_String_Length(string);
	while( i < string_length ) {
		USART1_Transmit(string[i++]);
	}
}

unsigned int Get_String_Length( char * string )
{
	/* Count string length */
	unsigned int i = 0;
	const unsigned int MAX_UNSIGNED_INT = -1;
	for(i = 0; i < MAX_UNSIGNED_INT; ++i) {
		if(string[i] == '\0') {return i;}
	}
	return -1;
}


// moter

void Open_Door_Once()
{
	if(opened)
	{
		return;
	}
	opened = 1;
	OCR1A = OPEN_MS;
	_delay_ms(1000);
	OCR1A = BASE_MS;
}

void Close_Door()
{
	opened = 0;
	OCR1A = BASE_MS;
}

void processCommand(unsigned char cmd) {
	char str_pre[5][100] = {
		"AT+RST\r\n",
		"AT+CWMODE=3\r\n",
		"AT+CWJAP=\"i9a203\",\"12345678\"\r\n",
		"AT+CIPSTART=\"TCP\",\"i9a203.p.ssafy.io\",3010\r\n",
		"AT+CIPMODE=0\r\n"
	};
	switch (cmd) {
		case '0':
		Close_Door();
		break;
		case '1':
		Open_Door_Once();
		break;
		default:
		Close_Door();
		for(int string_no = 3; string_no < 5; ++string_no) {
			USART1_Transmit_String(str_pre[string_no]);
			_delay_ms(1000);
		}
		break;
	}
}

// PWM

void Init_PWM()
{
	/* Enable OC1A(PB5) and use correct phase PWM */
	DDRB |= (1 << PB5);
	TCCR1A = (1 << COM1A1)|(1 << WGM11);
	TCCR1B = (1 << WGM13)|(1 << WGM12)|(1 << CS11);
	OCR1A = BASE_MS;
	ICR1 = 19999;
}