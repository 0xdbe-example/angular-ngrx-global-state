Angular Ngrx Global State
=========================

This tutorial walks you through creating a single global store with NgRx for Angular 12.
This tutorial is based on the official `tutorial <https://ngrx.io/guide/store>`_

**Note:** Code scaffolding is done via Angular CLI and NgRx Schematics to avoid writing common boilerplate.

Init app
--------

- Create new app

.. code-block:: console

  $ npx ng new \
      --routing \
      --style scss angular-ngrx-global-state

- Install NgRx Schematics for Angular CLI

.. code-block:: console

  $ ng add @ngrx/schematics

  ? Would you like to proceed? Yes
  ? Do you want to use @ngrx/schematics as the default collection? no

- Install NgRx dependencies

.. code-block:: console

  $ npm install -S @ngrx/{store,effects,entity,store-devtools}


Store
-----

Generate the initial state management files and register it within the ``app.module.ts``:

.. code-block:: console

  $ ng generate @ngrx/schematics:store GlobalState \
      --root \
      --module app.module.ts


This command did the following:

- Create reducers map file

.. code-block:: typescript
  :caption: src/app/reducers/index.ts

  import {
    ActionReducer,
    ActionReducerMap,
    createFeatureSelector,
    createSelector,
    MetaReducer
  } from '@ngrx/store';
  import { environment } from '../../environments/environment';

  export interface State {

  }

  export const reducers: ActionReducerMap<State> = {

  };

  export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];


- Import store in ``app-store`` module

.. code-block:: typescript
  :caption: src/app/auth/auth.module.ts
  :linenos:
  :emphasize-lines: 3-5, 12-13

  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { StoreModule } from '@ngrx/store';
  import { reducers, metaReducers } from './reducers';
  import { StoreDevtoolsModule } from '@ngrx/store-devtools';
  import { environment } from '../../environments/environment';

  @NgModule({
    declarations: [],
    imports: [
      CommonModule,
      StoreModule.forRoot(reducers, { metaReducers }),
      !environment.production ? StoreDevtoolsModule.instrument() : [],
    ]
  })
  export class AppStoreModule { }


Actions
-------

Generate the actions file:

.. code-block:: console

  $ ng generate @ngrx/schematics:action \
      --group --defaults --creators \
      --prefix counter \
      Counter


This command create the actions file and replace contents by the following:

.. code-block:: typescript
  :caption: src/app/actions/counter.actions.ts

  import { createAction } from '@ngrx/store';

  export const counterIncrement = createAction('[Counter Component] Increment');
  export const counterDecrement = createAction('[Counter Component] Decrement');
  export const counterReset = createAction('[Counter Component] Reset');


Reducer
-------

Generate a ``Counter`` reducer file and then, add it to a defined map of reducers

.. code-block:: console

  $ ng generate @ngrx/schematics:reducer Counter \
      --group --defaults \
      --reducers reducers/index.ts

This command did the following:

- Create reducer in which to add the following highlight lines:

.. code-block:: typescript
  :caption: src/app/reducers/counter.reducer.ts
  :linenos:
  :emphasize-lines: 2, 6, 10-12

  import { createReducer, on } from '@ngrx/store';
  import { counterIncrement, counterDecrement, counterReset } from '../actions/counter.actions';

  export const counterFeatureKey = 'counter';

  export const initialState = 0;

  export const reducer = createReducer(
    initialState,
    on(counterIncrement, (state) => state + 1),
    on(counterDecrement, (state) => state - 1),
    on(counterReset, (state) => 0)
  );


Component
---------

- Generate a ``Counter`` component

.. code-block:: console

  $ ng generate component counter


- Complete the component class

.. code-block:: typescript
  :caption: src/app/counter/counter.component.ts
  :linenos:
  :emphasize-lines: 2-4, 13, 16, 18, 24-26, 28-30, 32-34

  import { Component, OnInit } from '@angular/core';
  import { Observable } from 'rxjs';
  import { Store } from '@ngrx/store';
  import { counterIncrement, counterDecrement, counterReset } from '../actions/counter.actions';

  @Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.scss']
  })
  export class CounterComponent implements OnInit {

    count$: Observable<number>

    constructor(
      private store: Store<{ counter: number }>
    ) {
      this.count$ = store.select('counter');
    }

    ngOnInit(): void {
    }

    increment() {
      this.store.dispatch(counterIncrement());
    }

    decrement() {
      this.store.dispatch(counterDecrement());
    }

    reset() {
      this.store.dispatch(counterReset());
    }

  }


- Edit component template

.. code-block:: html
  :caption: src/app/counter/counter.component.ts

  <button (click)="increment()">Increment</button>

  <div>Current Count: {{ count$ | async }}</div>

  <button (click)="decrement()">Decrement</button>

  <button (click)="reset()">Reset Counter</button>

- Include counter component in app component

.. code-block:: html
  :caption: src/app/app.component.html

  <app-counter></app-counter>


Run
---

.. code-block:: console

  $ ng serve
