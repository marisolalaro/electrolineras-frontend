import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { PaginatorModule } from "primeng/paginator"; 
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DividerModule } from 'primeng/divider';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SlideMenuModule } from 'primeng/slidemenu';
import { TabMenuModule } from 'primeng/tabmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { SidebarModule } from 'primeng/sidebar';
import { SharedModule } from 'primeng/api';
import { ImageModule } from 'primeng/image';
// import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SplitterModule } from 'primeng/splitter';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DataViewModule } from 'primeng/dataview';

@NgModule({
  exports: [
    CardModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    TooltipModule,
    AccordionModule,
    RatingModule,
    SliderModule,
    InputTextModule,
    ToggleButtonModule,
    RippleModule,
    MultiSelectModule,
    DropdownModule,
    ProgressBarModule,
    ToastModule,
    DialogModule,
    MenubarModule,
    PanelModule,
    ChipModule,
    SplitButtonModule,
    CalendarModule,
    InputTextareaModule,
    InputSwitchModule,
    InputNumberModule,
    TabViewModule,
    PaginatorModule,
    AutoCompleteModule,
    DividerModule,
    MegaMenuModule, 
    MenuModule,
    ContextMenuModule,
    PanelMenuModule,
    SlideMenuModule,
    TabMenuModule,
    TieredMenuModule,
    SidebarModule,
    SharedModule,
    ImageModule,
    SplitterModule,
    ScrollPanelModule,
    DataViewModule
  ],
})
export class PrimeModule {}
