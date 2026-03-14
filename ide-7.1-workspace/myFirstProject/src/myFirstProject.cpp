#include <iostream>
#include <unistd.h>

using namespace std;

int main() {
	cout << "Hello World from QNX Neutrino RTOS!!!" << endl;
	cout << "Keshav Dhakal dhak0005@algonquinlive.com" << endl;
	cout << "I am a Barista" << endl;

	cout << "My PID is: " << getpid() << endl;
	cout << "My Parents's PID is: " << getppid() << endl;
	cout << endl;

	return EXIT_SUCCESS;
}
