import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatTooltipModule } from '@angular/material/tooltip';

// Directives
import { BlockInputDirective } from './block-input/block-input.directive';
import { IsTooltipDisabledDirective } from './is-tooltip-disabled/is-tooltip-disabled.directive';
import { ShowTooltipIfTruncatedDirective } from './show-tooltip-if-truncated/show-tooltip-if-truncated.directive';

@NgModule({
  imports: [CommonModule, MatTooltipModule],
  declarations: [BlockInputDirective, IsTooltipDisabledDirective, ShowTooltipIfTruncatedDirective],
  exports: [BlockInputDirective, IsTooltipDisabledDirective, ShowTooltipIfTruncatedDirective]
})
export class DirectivesModule { }
