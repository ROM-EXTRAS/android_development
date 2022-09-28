/*
 * Copyright (C) 2022 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {TraceType} from "common/trace/trace_type";
import {Viewer} from "viewers/viewer";
import {ViewerEvents} from "viewers/common/viewer_events";
import { ImePresenter } from "viewers/common/ime_presenter";
import { ImeUiData } from "viewers/common/ime_ui_data";

class ViewerInputMethod implements Viewer {
  constructor() {
    this.view = document.createElement("viewer-input-method");
    this.presenter = new ImePresenter((uiData: ImeUiData) => {
      // Angular does not deep watch @Input properties. Clearing inputData to null before repopulating
      // automatically ensures that the UI will change via the Angular change detection cycle. Without
      // resetting, Angular does not auto-detect that inputData has changed.
      (this.view as any).inputData = null;
      (this.view as any).inputData = uiData;
    }, this.getDependencies());
    this.view.addEventListener(ViewerEvents.HierarchyPinnedChange, (event) => this.presenter.updatePinnedItems(((event as CustomEvent).detail.pinnedItem)));
    this.view.addEventListener(ViewerEvents.HighlightedChange, (event) => this.presenter.updateHighlightedItems(`${(event as CustomEvent).detail.id}`));
    this.view.addEventListener(ViewerEvents.HierarchyUserOptionsChange, (event) => this.presenter.updateHierarchyTree((event as CustomEvent).detail.userOptions));
    this.view.addEventListener(ViewerEvents.HierarchyFilterChange, (event) => this.presenter.filterHierarchyTree((event as CustomEvent).detail.filterString));
    this.view.addEventListener(ViewerEvents.PropertiesUserOptionsChange, (event) => this.presenter.updatePropertiesTree((event as CustomEvent).detail.userOptions));
    this.view.addEventListener(ViewerEvents.PropertiesFilterChange, (event) => this.presenter.filterPropertiesTree((event as CustomEvent).detail.filterString));
    this.view.addEventListener(ViewerEvents.SelectedTreeChange, (event) => this.presenter.newPropertiesTree((event as CustomEvent).detail.selectedItem));
  }

  public notifyCurrentTraceEntries(entries: Map<TraceType, any>): void {
    this.presenter.notifyCurrentTraceEntries(entries);
  }

  public getView(): HTMLElement {
    return this.view;
  }

  public getTitle(): string {
    return "";
  }

  public getDependencies(): TraceType[] {
    return ViewerInputMethod.DEPENDENCIES;
  }

  public static readonly DEPENDENCIES: TraceType[] = [];
  private view: HTMLElement;
  private presenter: ImePresenter;
}

export {ViewerInputMethod};
