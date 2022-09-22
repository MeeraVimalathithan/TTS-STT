import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  myText = "Hello Meera";
  recording = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    SpeechRecognition.requestPermission();
  }

  async startRecognition() {
    const { available } = await SpeechRecognition.available();
    if (available) {
      this.recording = true;
      SpeechRecognition.start({
        popup : false,
        partialResults : true,
        language : "en-US",

      });
    }

    SpeechRecognition.addListener("partialResults", (data: any) => {
      console.log("Hi Meera", data);
      console.log("partialResults was fired", data.matches);
      if(data.matches && data.matches.length > 0) {
        this.myText = data.matches[0];
        this.changeDetectorRef.detectChanges();
      }

      console.log("partialResults was fired", data.value);

      if(data.value && data.value.length > 0) {
        this.myText = data.value[0];
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  async stopRecognition() {
    this.recording = false;
    await SpeechRecognition.stop();
  }

  speakText(){
    TextToSpeech.speak({
      text: this.myText,
    })
  }
}
