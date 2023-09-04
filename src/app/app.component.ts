import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendService } from './backend.service';
import { BehaviorSubject, MonoTypeOperatorFunction, Observable, combineLatestWith, map, pipe, startWith } from 'rxjs';
import { Instruction, InstructionVersion } from './model';
import { SbbSortState, SbbTableDataSource } from '@sbb-esta/angular/table';
import { SbbTableModule } from '@sbb-esta/angular/table';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SbbTableModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  title = 'nested-sbb-table';
  data$: Observable<(Instruction | InstructionVersion)[]>;
  sortState$ = new BehaviorSubject<SbbSortState>({active: 'versionlabel', direction: 'asc'})

  nameFilter = new FormControl<string>('');
  operatingPointFilter = new FormControl<string>('');

  constructor(backendService: BackendService) {
    this.data$ = backendService.loadData$().pipe(
      this.filterByName(),
      this.filterByOperatingPoint(),
      this.sort(),
      map(instructions => instructions.map(instruction => [instruction, ...instruction.versions]).flat())
    );
  }

  public isInstruction(index: number, item: Instruction | InstructionVersion): boolean {
    return !item.hasOwnProperty('type');
  }

  private filterByName(): MonoTypeOperatorFunction<Instruction[]> {
    return pipe(
      combineLatestWith(this.nameFilter.valueChanges.pipe(startWith(this.nameFilter.value))),
      map(([instructions, filterText]) => instructions.filter(instruction => instruction.label.toLocaleLowerCase().includes(filterText?.toLocaleLowerCase() ?? '')))
    )
  }

  private filterByOperatingPoint(): MonoTypeOperatorFunction<Instruction[]> {
    return pipe(
      combineLatestWith(this.operatingPointFilter.valueChanges.pipe(startWith(this.nameFilter.value))),
      map(([instructions, filterText]) => instructions
        .map(instruction => ({
          ...instruction,
          versions: instruction.versions.filter(version =>
            version.operatingPoint.toLocaleLowerCase().includes(filterText?.toLocaleLowerCase() ?? '§'))
        }))
        .filter(instruction => instruction.versions.length > 0)
      ));
  }

  public sort(): MonoTypeOperatorFunction<Instruction[]> {
    return pipe(
      combineLatestWith(this.sortState$),
      map(([instructions, sortState]) => {
        var sortedInstructions = [...instructions];
        const sortMultiplier = sortState.direction === 'asc' ? 1 : -1;
        if (sortState.active === 'versionlabel') {
          sortedInstructions.sort((a, b) => a.label.localeCompare(b.label) * sortMultiplier)
        }
        // note: better to provide a dictionary with a comparator for each table column
        if (sortState.active === 'operatingPoint') {
          sortedInstructions = sortedInstructions.map(instruction => ({
            ...instruction, 
            versions: instruction.versions.sort((a, b) => a.operatingPoint.localeCompare(b.operatingPoint) * sortMultiplier)
          }));
          sortedInstructions.sort((a, b) => {
            for (let versionIndex = 0; versionIndex < Math.min(a.versions.length, b.versions.length); versionIndex++) {
              const result = a.versions[versionIndex].operatingPoint.localeCompare(b.versions[versionIndex].operatingPoint) * sortMultiplier;
              if (result != 0) {
                return result;
              }
            }
            return a.versions.length > b.versions.length ? 1 : -1;
          });
        }

        return sortedInstructions;
      }),
    );
  }

  public onSortChange(sortState: SbbSortState) {
    this.sortState$.next(sortState);
  }

  private sortMultiplier(sortState: SbbSortState): number {
    return sortState.direction === 'asc' ? 1 : -1;
  }
}
