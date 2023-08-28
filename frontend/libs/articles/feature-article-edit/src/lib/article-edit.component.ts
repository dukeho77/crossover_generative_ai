import { DynamicFormComponent, Field, formsActions, ListErrorsComponent, ngrxFormsQuery } from '@realworld/core/forms';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { articleActions, articleEditActions, articleQuery } from '@realworld/articles/data-access';
import { take } from 'rxjs/operators';

const structure: Field[] = [
  {
    type: 'INPUT',
    name: 'title',
    placeholder: 'Article Title',
    validator: [Validators.required],
  },
  {
    type: 'INPUT',
    name: 'description',
    placeholder: "What's this article about?",
    validator: [Validators.required],
  },
  {
    type: 'TEXTAREA',
    name: 'body',
    placeholder: 'Write your article (in markdown)',
    validator: [Validators.required],
  },
  {
    type: 'INPUT',
    name: 'tagList',
    placeholder: 'Enter Tags',
    validator: [],
  },
];

@UntilDestroy()
@Component({
  selector: 'cdt-article-edit',
  standalone: true,
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css'],
  imports: [DynamicFormComponent, ListErrorsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleEditComponent implements OnInit, OnDestroy {
  structure$ = this.store.select(ngrxFormsQuery.selectStructure);
  data$ = this.store.select(ngrxFormsQuery.selectData);

  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.store.dispatch(formsActions.setStructure({ structure }));

    this.store
      .select(articleQuery.selectData)
      .pipe(untilDestroyed(this))
      .subscribe((article) => this.store.dispatch(formsActions.setData({ data: article })));
  }

  updateForm(changes: any) {
    this.store.dispatch(formsActions.updateData({ data: changes }));
  }

  submit() {
    this.data$.pipe(take(1)).subscribe(data => {
      const tagListValue: string | undefined = data?.tagList;
  
      // Split the tagListValue string into an array of tags
      const tagList: string[] = tagListValue ? tagListValue.split(',').map(tag => tag.trim()) : [];
  
      // Update the data with the formatted tagList
      const updatedData = { ...data, tagList };
  
      // Dispatch the action with the updated data
      this.store.dispatch(formsActions.updateData({ data: updatedData }));
      this.store.dispatch(articleEditActions.publishArticle());
    });
  }
  
  ngOnDestroy() {
    this.store.dispatch(formsActions.initializeForm());
  }
}
