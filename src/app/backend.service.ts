import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Instruction, InstructionVersion } from './model';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor() { }

  public loadData$(): Observable<Instruction[]> {
    return of([
      {
        label: 'Vorgabe 1',
        versions: [
          { label: 'Vorgabe 1a', operatingPoint: 'Bern', type: 'Hauptleis' } as InstructionVersion,
          { label: 'Vorgabe 1b', operatingPoint: 'Wankdorf', type: 'Hauptleis' } as InstructionVersion,
        ]
      } as Instruction,
      {
        label: 'Vorgabe 2',
        versions: [
          { label: 'Vorgabe 2a', operatingPoint: 'Bern', type: 'Hauptleis' } as InstructionVersion,
          { label: 'Vorgabe 2b', operatingPoint: 'Zürich', type: 'Hauptleis' } as InstructionVersion,
        ]
      } as Instruction,
      {
        label: 'Vorgabe 3',
        versions: [
          { label: 'Vorgabe 3a', operatingPoint: 'Bern', type: 'Hauptleis' } as InstructionVersion,
          { label: 'Vorgabe 3b', operatingPoint: 'Olten', type: 'Hauptleis' } as InstructionVersion,
        ]
      } as Instruction,
      {
        label: 'Vorgabe 4',
        versions: [
          { label: 'Vorgabe 4a', operatingPoint: 'Bern', type: 'Hauptleis' } as InstructionVersion,
          { label: 'Vorgabe 4b', operatingPoint: 'Wankdorf', type: 'Hauptleis' } as InstructionVersion,
        ]
      } as Instruction,
    ])
  }
}
