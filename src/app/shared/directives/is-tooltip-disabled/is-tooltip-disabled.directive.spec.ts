import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, HostListener, NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs'; // avoids logging 'console.warn: ...longpress...'

// Material
import { MatTooltipModule } from '@angular/material/tooltip';

import { IsTooltipDisabledDirective } from './is-tooltip-disabled.directive';

@Component({
  template: `
    <span
      [mfPeIsTooltipDisabled]
      #textWrapper="tooltipDisabled"
      [matTooltip]="'Tooltip Example'"
      matTooltipPosition="below"
      [tooltipWidthLimit]="86"
      [matTooltipDisabled]="textWrapper.tooltipDisabled"
      >{{ text }}</span
    >
  `
})
class TestComponent {
  hoverCount = 0;
  text = 'This is an example tooltip';

  constructor() {}

  @HostListener('mouseenter')
  onEnter() {
    /**
     * This is for demonstration purposes only since the actual implementation of the directive cannot be
     * immediately tested due to the fact that jsDom doesn't do layouting, and I'm not going above and beyond
     * at the moment. ¯\_(ツ)_/¯
     */
    this.hoverCount = ++this.hoverCount;
  }
}

describe('IsTooltipDisabledDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let spanEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TestComponent, IsTooltipDisabledDirective],
      imports: [NoopAnimationsModule, MatTooltipModule]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    spanEl = fixture.nativeElement.querySelector('span');

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should increment the hoverCount on mouseenter', () => {
    spanEl.dispatchEvent(
      new MouseEvent('mouseenter', {
        view: window,
        bubbles: true,
        cancelable: true
      })
    );
    fixture.detectChanges();

    expect(component.hoverCount).toBe(1);
  });
});
