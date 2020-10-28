import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';

// Directive
import { BlockInputDirective } from './block-input.directive';

@Component({
  template: `
    <div [mfPeBlockInput]="'[^a-zA-Z]*'">
      <input id="myInput" [(ngModel)]="myInputValue" />
    </div>
  `
})
class TestComponent {
  @ViewChild(BlockInputDirective, { static: false })
  myDirective: BlockInputDirective;
  myInputValue = '';
}

describe('BlockInputDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockInputDirective, TestComponent],
      imports: [FormsModule]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  it('should have a defined pattern attribute', () => {
    fixture.detectChanges();

    expect(component.myDirective.pattern).toMatch('[^a-zA-Z]*');
  });

  it('should NOT stop event propagation', () => {
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#myInput'));
    const inputElement = input.nativeElement;
    const event = new Event('input', { bubbles: true });

    inputElement.value = 'test';
    inputElement.dispatchEvent(event);
    fixture.detectChanges();

    const eventSpy = jest.spyOn(event, 'stopPropagation');

    inputElement.value = 'test';
    inputElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(eventSpy).not.toHaveBeenCalled();
    expect(inputElement.value).toMatch('test');
  });

  it('should prevent any numbers or special characters', () => {
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#myInput'));
    const inputElement = input.nativeElement;
    const event = new Event('input', { bubbles: true });
    const eventSpy = jest.spyOn(event, 'stopPropagation');

    inputElement.value = 'test1';
    inputElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(eventSpy).toHaveBeenCalled();
    expect(inputElement.value).toMatch('test');
  });

  it('should allow alphabetical characters', () => {
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#myInput'));
    const inputElement = input.nativeElement;
    const event = new Event('input', { bubbles: true });

    inputElement.value = 'test';
    inputElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(inputElement.value).toEqual('test');
  });
});
