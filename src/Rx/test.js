/**
 * Created by haven on 16/8/16.
 */

// import Rx from  'rx'
// import Rx from '../../node_modules/rxjs-es/Rx'


var button = document.querySelector('button')
Rx.Observable.fromEvent(button, 'click')
    // .throttle(1000)
    .map(event => event.clientX)
    .scan((count, clientX) => count + clientX, 0)
    .subscribe(count => console.log(count));