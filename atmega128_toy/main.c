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

// motor commands
#define COMMANDS 5
void processCommand(unsigned char cmd);
void forwardAMotor();
void forwardBMotor();
void stopAMotor();
void stopBMotor();
void reverseAMotor();
void reverseBMotor();
void moveForward();
void moveBackward();
void stopMotors();
void rightTurn();
void leftTurn();
void pivotTurn();

// PWM
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
		"GET /iot/1t HTTP/1.1\r\nHost: i9a203.p.ssafy.io:3010\r\nConnection: keep-alive\r\n\r\n"
	};
	
	// initialization
	cli();
	USART1_Init ( MYUBRR );
	sei();
	
	Init_Moter();
	
	Init_PWM();
	
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

void Init_Moter()
{
	/* use PORT C */
	DDRC |= (1 << PC0) | (1 << PC1) | (1 << PC2) | (1 << PC3);
}

void processCommand(unsigned char cmd)
{
	/* switch cases by command */
	switch (cmd) {
		case '0':
		stopMotors();
		break;
		case '1':
		moveForward();
		break;
		case '2':
		stopMotors();
		break;
		case '3':
		moveBackward();
		break;
		case '4':
		rightTurn();
		break;
		case '5':
		leftTurn();
		break;
		case '6':
		pivotTurn();
		default:
		stopMotors();
		for(int string_no = 3; string_no < 5; ++string_no) {
			USART1_Transmit_String(str_pre[string_no]);
			_delay_ms(1000);
		}
		break;
	}
}

// A모터를 전진
void forwardAMotor()
{
	PORTC &= ~(1 << PC0);
	PORTC |= (1 << PC1);
}

// A모터를 정지
void stopAMotor()
{
	PORTC &= ~(1 << PC0);
	PORTC &= ~(1 << PC1);
}

// A모터를 후진
void reverseAMotor()
{
	PORTC |= (1 << PC0);
	PORTC &= ~(1 << PC1);
}

// B모터를 전진
void forwardBMotor()
{
	PORTC |= (1 << PC2);
	PORTC &= ~(1 << PC3);
}

// B모터를 정지
void stopBMotor()
{
	PORTC &= ~(1 << PC2);
	PORTC &= ~(1 << PC3);
}

// B모터를 후진
void reverseBMotor()
{
	PORTC &= ~(1 << PC2);
	PORTC |= (1 << PC3);
}

// 전진 (A모터 전진, B모터 전진)
void moveForward()
{
	forwardAMotor();
	forwardBMotor();
}

// 정지 (A모터 정지, B모터 정지)
void stopMotors()
{
	stopAMotor();
	stopBMotor();
}

// 후진 (A모터 후진, B모터 후진)
void moveBackward()
{
	reverseAMotor();
	reverseBMotor();
}

// 우회전 (A모터 전진, B모터 정지)
void rightTurn()
{
	forwardAMotor();
	stopBMotor();
}

// 좌회전 (A모터 정지, B모터 전진)
void leftTurn()
{
	stopAMotor();
	forwardBMotor();
}

// 제자리 걷기 (A모터 전진, B모터 후진)
void pivotTurn()
{
	forwardAMotor();
	reverseBMotor();
}

// PWM

void Init_PWM()
{
	/* Enable OC0(PB4) and use correct phase PWM */
	DDRB |= (1 << PB4);
	TCCR0 = (1 << WGM00)|(1 << COM01)|(0b001 << CS0);
	OCR0 = 0xBF;
}