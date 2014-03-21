//LED Control on/off
int togglePin1 = 7;
int togglePin2 = 8;
int togglePin3 = 9;
int togglePin4 = A0;
char dataIn;
int previousState1 = 0;
int previousState2 = 0;
int previousState3 = 0;
int previousState4 = 0;

//PIR Sensor
int pirPin = 2;
int minSecsBetweenEmails = 10; // 1 min
long lastSend = -minSecsBetweenEmails * 1000l;

void setup() {
  // initiate serial communication:
  Serial.begin(9600);
  pinMode(togglePin1, OUTPUT);
  pinMode(togglePin2, OUTPUT);
  pinMode(togglePin3, OUTPUT);
  pinMode(togglePin4, OUTPUT);
  pinMode(pirPin, INPUT);
}

void loop() {
//------------PIR SENSOR SETTING--------------------------------------------
long now = millis();
  if (digitalRead(pirPin) == HIGH)
  {
    if (now > (lastSend + minSecsBetweenEmails * 1000l))
    {
      Serial.println("mail");
      lastSend = now;
    }
    else
    {
      Serial.println("tunda");
    }
    //delay(5000);
  }
  delay(5000);
  
  
  
//-------------LED TOGGLE SETTING--------------------------------------------------------------------------------------
  // MENERIMA data dari node dan menuliskan ke dalam string
  if (Serial.available() > 0){
    dataIn = Serial.read();

    if (dataIn == '2'){
      digitalWrite(togglePin1, HIGH);
      //delay(10);
    }
    
    else if (dataIn == '1'){
      digitalWrite(togglePin1, LOW);
      delay(10);
    }
    
    else if (dataIn == '4'){
      digitalWrite(togglePin2, HIGH);
      delay(10);
    }
    
    else if (dataIn == '3'){
      digitalWrite(togglePin2, LOW);
      //delay(10);
    }
    
    else if (dataIn == '6'){
      digitalWrite(togglePin3, HIGH);
     // delay(10);
    }
    
    else if (dataIn == '5'){
      digitalWrite(togglePin3, LOW);
      //delay(10);
    }
    
    else if (dataIn == '8'){
      digitalWrite(togglePin4, HIGH);
      //delay(10);
    }
    
    else{
      digitalWrite(togglePin4, LOW);
      //delay(10);
    }
    
  }
  
  //------notifikasi lampu 1---------
  int currentState1 = digitalRead(togglePin1);
    if(currentState1 != previousState1){
      Serial.println("perubahanStatuslampu1"); }
    previousState1 = currentState1;
    char statusLampu1[30];
    sprintf(statusLampu1, "la%d", previousState1); 
    //Serial.println(statusLampu1);
    //delay(1000);
  
  //------notifikasi lampu 2---------
  int currentState2 = digitalRead(togglePin2);
    if(currentState2 != previousState2){
      Serial.println("perubahanStatuslampu2"); }
    previousState2 = currentState2;
    char statusLampu2[30];
    sprintf(statusLampu2, "lb%d", previousState2);
    //Serial.println(statusLampu2);
    //delay(1000);
  
  //-------notifikasi lampu 3--------
  int currentState3 = digitalRead(togglePin3);
    if(currentState3 != previousState3){
      Serial.println("perubahanStatuslampu3"); }
    previousState3 = currentState3;
    char statusLampu3[30];
    sprintf(statusLampu3, "lc%d", previousState3);
    //Serial.println(statusLampu3);
    //delay(1000);
  
  //-------notifikasi lampu 4---------
  
  int currentState4 = digitalRead(togglePin4);
    if(currentState4 != previousState4){
      Serial.println("perubahanStatuslampu4"); }
    previousState4 = currentState4;
    char statusLampu4[30];
    sprintf(statusLampu4, "ld%d", previousState4);
    //Serial.println(statusLampu4);
    //delay(1000);
  
  Serial.println(statusLampu1);
  Serial.println(statusLampu2);
  Serial.println(statusLampu3);
  Serial.println(statusLampu4);
  delay(50);
  //kirim perintah ke node.js untuk dieksekusi
  //char perintah[50];
  //sprintf(perintah, "SPL1%dL2%dL3%dL4%dE", previousState1, previousState2, previousState3, previousState4);
  //Serial.println(perintah);
  
}
