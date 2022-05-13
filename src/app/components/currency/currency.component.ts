import { Component, OnInit } from '@angular/core';
import {concatMap, delay, Observable, of, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WebsocketService} from "../../websocket";
import {WS} from "../../webscocket.events";
import {MessageService} from "../../shared/message.service";

import * as Highcharts from 'highcharts';
import {webSocket} from "rxjs/webSocket";

export interface IMessage {
  id: number;
  text: string;
}

export class Message {
  messageContent!: string;
}

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {
  messages$!: Observable<IMessage[]>;
  counter$!: Observable<number>;
  texts$!: Observable<string[]>;
  messageGUI!: Message;

  public form!: FormGroup;
  private tmp$!: Observable<any>;

  title = 'Angular-RxJsWebSocket-HighCharts';
  public rate: any;
  public rateYura: any;
  rate$!: Subscription;
  rateYura$!: Subscription;
  Highcharts: typeof Highcharts = Highcharts;
  chardata: any[] = [];
  chardataYura: any[] = [];
  chartOptions: any;
  subject = webSocket('wss://ws.coincap.io/prices?assets=bitcoin');
  subjectYura = webSocket('wss://ws.coincap.io/prices?assets=bitcoin');

  constructor(private fb: FormBuilder, private wsService: WebsocketService,private message: MessageService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      text: [null, [
        Validators.required
      ]],
    });

    this.rate = this.subjectYura.pipe(
      concatMap(item => of (item).pipe(delay(1000)))
    ).subscribe(data => {
      this.rate = data;
      this.chardata.push(Number(this.rate.bitcoin))
      console.log(this.chardata)

      this.chartOptions = {
        series: [{
          data: this.chardata,
        }, ],
        chart: {
          type: "area",
          zoomType: 'x',
        },
        title: {
          text: "Yura chart",
        },
        xAxis: {
          type: "datetime",
          labels: {
            //@ts-ignore
            formatter: function() {
              return Highcharts.dateFormat('%H:%M %b/%e', Date.now());
            }
          }
        },
        yAxis: {
          title: {
            text: 'USD'
          }
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
              },
              stops: [
                //@ts-ignore
                [0, Highcharts.getOptions().colors[0]],
                //@ts-ignore
                [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
              ]
            },
            marker: {
              radius: 2
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1
              }
            },
            threshold: null
          }
        },
      };
    })

    this.rateYura = this.subjectYura.pipe(
      concatMap(item => of (item).pipe(delay(1000)))
    ).subscribe(data => {
      this.rateYura = data;
      this.chardataYura.push(Number(this.rateYura.bitcoin))
      console.log(this.chardataYura)
      // this.chartOptions = {
      //   series: [{
      //     data: this.chardata,
      //   }, ],
      //   chart: {
      //     type: "candlestick",
      //     zoomType: 'x'
      //   },
      //   title: {
      //     text: "linechart",
      //   },
      // };
    })


    // get messages
    this.messages$ = this.wsService.on<IMessage[]>(WS.ON.MESSAGES);


    // get counter
    this.counter$ = this.wsService.on<number>(WS.ON.COUNTER);

    //tmp
    this.tmp$ = this.wsService.on<any>(WS.ON.ANY);

    // get texts
    this.texts$ = this.wsService.on<string[]>(WS.ON.UPDATE_TEXTS);
  }

  getChart() {
    this.chartOptions = {
      series: [{
        data: this.chardata,
      }, ],
      chart: {
        type: "line",
        zoomType: 'x'
      },
      title: {
        text: "linechart",
      },
    };
  }


  public sendText(): void {
    if (this.form.valid) {
      this.wsService.send(WS.SEND.SEND_TEXT, this.form.value.text);
      this.message.sendMessage(this.form.value.text);
      this.messageGUI = new Message();
      this.messageGUI.messageContent = this.form.value.text;

      this.message.sendMessage(this.messageGUI).subscribe(
        (result) => {
          console.log(result)
        },
        (error) => {
          console.error(error);
        },
        () => {
          // this.authState.setAuthState(true);
        }
      );



      this.form.reset();
    }
  }

  public removeText(index: number): void {
    this.wsService.send(WS.SEND.REMOVE_TEXT, index);
  }
}
