import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { Country } from '../models/country.model';

interface RestCountry {
  cca2: string;
  flag: string;
  name: { common: string };
  translations?: { spa?: { common: string } };
  idd?: { root?: string; suffixes?: string[] };
}

@Injectable({ providedIn: 'root' })
export class CountryService {
  private readonly http = inject(HttpClient);

  readonly countries$: Observable<Country[]> = this.http
    .get<RestCountry[]>('data/countries.json')
    .pipe(
      map(countries => countries
        .map(country => ({
          code: country.cca2,
          name: country.translations?.spa?.common ?? country.name.common,
          flag: country.flag,
          dialCode: this.toDialCode(country.idd),
        }))
        .sort((a, b) => a.name.localeCompare(b.name, 'es'))),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  private toDialCode(idd?: RestCountry['idd']): string {
    if (!idd?.root) return '';
    if (idd.root === '+1' || idd.root === '+7') return idd.root;
    return `${idd.root}${idd.suffixes?.[0] ?? ''}`;
  }
}
