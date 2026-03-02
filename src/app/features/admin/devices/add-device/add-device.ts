import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DeviceServices, CreateDevicePayload, DeviceStatus } from '../../../../core/services/devices/device-services';
import { ZoneServices, Zone } from '../../../../core/services/zones/zone-services';

type AddDeviceForm = FormGroup<{
  deviceId: FormControl<string>;
  name: FormControl<string>;
  zone: FormControl<string>;
  sensorsText: FormControl<string>; // "a,b,c"
  status: FormControl<DeviceStatus>;
  description: FormControl<string>;
}>;

@Component({
  selector: 'app-add-device',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  templateUrl: './add-device.html',
  styleUrl: './add-device.scss',
})
export class AddDevice {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private deviceService = inject(DeviceServices);
  private zoneService = inject(ZoneServices);

  loadingZones = true;
  saving = false;

  errorKey = '';
  successKey = '';

  zones: Zone[] = [];

  form: AddDeviceForm = this.fb.nonNullable.group({
    deviceId: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    name: this.fb.nonNullable.control(''),
    zone: this.fb.nonNullable.control('', [Validators.required]),
    sensorsText: this.fb.nonNullable.control(''),
    status: this.fb.nonNullable.control<DeviceStatus>('offline', [Validators.required]),
    description: this.fb.nonNullable.control(''),
  }) as AddDeviceForm;

  constructor() {
    this.loadZones();
  }

  loadZones() {
    this.loadingZones = true;
    this.zoneService.getAllZones().subscribe({
      next: (res: any) => {
        this.zones = res?.items ?? res?.zones ?? res ?? [];
        this.loadingZones = false;

        // optionnel: auto-select première zone
        if (!this.form.controls.zone.value && this.zones.length > 0) {
          this.form.controls.zone.setValue((this.zones[0] as any)._id);
        }
      },
      error: () => {
        this.loadingZones = false;
        this.errorKey = 'DEVICES.ERROR.LOAD_ZONES';
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorKey = '';
    this.successKey = '';

    const sensors = this.parseSensors(this.form.controls.sensorsText.value);

    const payload: CreateDevicePayload = {
      deviceId: this.form.controls.deviceId.value.trim(),
      name: this.form.controls.name.value.trim(),
      zone: this.form.controls.zone.value,
      sensors,
      status: this.form.controls.status.value,
      description: this.form.controls.description.value.trim(),
    };

    this.deviceService.addDevice(payload).subscribe({
      next: () => {
        this.saving = false;
        this.successKey = 'DEVICES.SUCCESS.CREATED';
        setTimeout(() => this.router.navigateByUrl('/admin/devices'), 600);
      },
      error: () => {
        this.saving = false;
        this.errorKey = 'DEVICES.ERROR.CREATE';
      },
    });
  }

  parseSensors(text: string): string[] {
    if (!text?.trim()) return [];
    return text
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }

  // getters (pour validation)
  get deviceId() {
    return this.form.controls.deviceId;
  }
  get zone() {
    return this.form.controls.zone;
  }
}