import { MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { PrimeNGConfig } from "primeng/api";

@Injectable()
export class HelpersService {
    constructor(
        private messageService: MessageService,
        private primengConfig: PrimeNGConfig,
        private translateService: TranslateService
    ) { }
    public messageNotification(severity: any, detail: any, life?: any) {
        if (this.isNull(severity) || this.isNull(detail))
            return (this.messageService.add({ severity: 'error', detail: 'No se pudo recuperar el estado de registro.', life: 3000 }));
        if (this.isNull(life))
            life = 3000;
        return (this.messageService.add({ severity: severity, detail: detail, life: life }));
    }
    private isNull(obj: any) {
        if (typeof obj === 'undefined' || obj === null || obj == "")
            return true;
        else
            return false;
    }
    public translateChange(lang: string) {
        this.translateService.use(lang)
        this.translateService.get('primeng').subscribe((res) => this.primengConfig.setTranslation(res))
    }
}