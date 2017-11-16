/**
 * Created by Licentiu Kovacs - 1st Nov 2017
 * Directive that allows to drag a certain dom element on the screen.
 * Emits the new screen coordinates on movement end.
 * Emits its current status on each drag operation: mousedown, dragging, mouseup
 * Usage:
 *   - simple use:
 *   <div appMoveMe> Move Me </div
 *
 *   - and with additional non-mandatory bindings
 *   <div appMoveMe
 *        [allowControlToBeMoved]="checkboxStatus"
 *        (coordinates)="logMe($event)"
 *        (status)="logMe($event)"
 *        > Move Me </div>
 *
 *   16.11.2017:
 *   - setting grab area to a child element having custom class '.window-header'
 *      - grabbing this child element will move the entire parent element, the rest of the parent element will not react to drag and drop.
 *      - if such a child element is not found, you can move the parent element by grabbing anywhere on it.
 */

import { AfterContentInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/takeUntil';

@Directive({
  selector: '[appMoveMe]'
})
export class MoveMeDirective implements OnDestroy, AfterContentInit {
  @Output('coordinates') private coordinates: EventEmitter<{ x: number, y: number }> = new EventEmitter<{ x: number, y: number }>();
  @Output('status') private status: EventEmitter<any> = new EventEmitter<any>();
  @Input('allowControlToBeMoved') public allowControlToBeMoved = true;

  private subscription: Subscription;
  private initialX: number;
  private initialY: number;
  private initialWindowX: number;
  private initialWindowY: number;
  private dragNDropGrabArea: HTMLElement;

  constructor(private el: ElementRef) {}

  ngAfterContentInit() {
    // if an element having a custom class .window-header is found than that element will allow by dragging it to drag the entire window
    // otherwise you can move the window by grabbing anywhere on it
    const windowHeader = this.el.nativeElement.querySelector('.window-header');
    this.dragNDropGrabArea = windowHeader ? windowHeader : this.el.nativeElement;

    this.setInitialStylingForMovement(this.el);

    const mouseDown$ = Observable.fromEvent(this.dragNDropGrabArea, 'mousedown');
    const mouseUp$ = Observable.fromEvent(document, 'mouseup');
    const mouseMove$ = Observable.fromEvent(document, 'mousemove');

    const dragNDrop$ = mouseDown$
      .mergeMap((event: MouseEvent) => {
        this.saveWindowCornerToMouseOffsets(this.el, event);
        this.saveWindowOffsets(this.el);
        this.status.emit('mousedown');

        return mouseMove$
          .throttleTime(10)
          .takeWhile(() => this.allowControlToBeMoved === true)
          .map((ev: MouseEvent) => {
            ev.preventDefault();
            return ev;
          })
          .do(() => this.styleMovingWindow(this.el, this.status))
          .takeUntil(mouseUp$
            .do(() => {
                this.status.emit('mouseup');
                this.emitValues(this.el);
                this.unStyleAfterMovingWindow(this.el);
              }
            ));
      });

    this.subscription = dragNDrop$
      .subscribe(
        // next
        (event: MouseEvent) => this.moveElement(this.el, event.clientX + this.initialX, event.clientY + this.initialY),
        // error
        console.log,
        // completion
        () => console.log('completed')
      );
  }

  /**
   * Sets the initial requirements for the Element to be movable to a new position
   * @param {ElementRef} el
   */
  setInitialStylingForMovement(el: ElementRef): void {
    el.nativeElement.style.position = 'absolute';
    el.nativeElement.style.userSelect = 'none';
    el.nativeElement.style.margin = 0;
    el.nativeElement.style.padding = 0;
  }

  /**
   * Retain initial window-corner-to-click offsets
   * @param {ElementRef} el
   * @param {MouseEvent} event
   */
  saveWindowCornerToMouseOffsets(el: ElementRef, event: MouseEvent): void {
    // retain initial click-to-window-corner-coordinates offsets
    this.initialX = el.nativeElement.offsetLeft - event.clientX;
    this.initialY = el.nativeElement.offsetTop - event.clientY;
  }

  /**
   * Retains initial window coordinates, will be used to optimize the event emitting  (will not emit if coordinates are the same)
   * @param {ElementRef} el
   */
  saveWindowOffsets(el: ElementRef): void {
    this.initialWindowX = el.nativeElement.offsetLeft;
    this.initialWindowY = el.nativeElement.offsetTop;
  }

  /**
   * Styles the current window during the drag-n-drop operation
   * @param {ElementRef} el -
   * @param {EventEmitter<string>} status
   */
  styleMovingWindow(el: ElementRef, status: EventEmitter<string>): void {
    // report status to the upper level
    status.emit('dragging');
    el.nativeElement.style.cursor = 'move';
    el.nativeElement.style.opacity = 0.5;
  }

  /**
   * Resets the styles applied to a window during drag-n-drop operation
   * @param {ElementRef} el - the ElementRef to be styled
   */
  unStyleAfterMovingWindow(el: ElementRef) {
    el.nativeElement.style.cursor = 'auto';
    el.nativeElement.style.opacity = 1;
  }

  /**
   * Changes the left and top distances of an ElementRef with values provided
   * @param {ElementRef} el
   * @param {number} newClientX - new X coordinate
   * @param {number} newClientY - new Y coordinate
   */
  moveElement(el: ElementRef, newClientX: number, newClientY: number): void {
    el.nativeElement.style.left = newClientX + 'px';
    el.nativeElement.style.top = newClientY + 'px';
  }

  /**
   * Emit window coordinates to the upper level, on 'mouseup'
   * Emits only if a move operation was done (coordinates are different)
   * @param {ElementRef} el
   */
  emitValues(el: ElementRef): void {
    if ((this.initialWindowX !== el.nativeElement.offsetLeft) &&
      (this.initialWindowY !== el.nativeElement.offsetTop ) &&
      (this.initialWindowX && this.initialWindowY)) {
      this.coordinates.emit(
        {
          x: el.nativeElement.style.left.replace('px', ''),
          y: el.nativeElement.style.top.replace('px', '')
        });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
