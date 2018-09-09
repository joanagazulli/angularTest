import { Component, OnInit} from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  
  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;
  commentForm: FormGroup;
  comment: Comment;
  formErrors = {
    'author': '',
    'comment': '',    
  };
  validationMessages={
    'author': {
      'required': 'Name is required',
      'minlength':'Name must be at least 2 characters long.',
      'maxlength':'Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required': 'Comment is required',
    }
  }
  
  constructor(private dishservice: DishService, private route: ActivatedRoute, 
    private location: Location, private comm: FormBuilder) {
      this.createForm();
     }

    ngOnInit() {
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(+params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
    }
    createForm(){
      this.commentForm= this.comm.group({
        author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
        comment: ['', Validators.required],
        rating: ['']
      });
      this.commentForm.valueChanges.subscribe(data=> this.onValueChanged(data));
      this.onValueChanged();
    }
    onSubmit(){
      this.comment=this.commentForm.value;
      this.comment.date = new Date().toISOString();     
      console.log(this.comment);
      this.dish.comments.push(this.comment);
      this.commentForm.reset({
        author: '',
        comment: '',
        rating: 5
      });
    
    }   
    
    onValueChanged(data?: any){
      if (!this.commentForm) {return;}
      const form=this.commentForm;
      for (const field in this.formErrors){
        if(this.formErrors.hasOwnProperty(field))
        this.formErrors[field]='';
        const control =form.get(field);
        if (control && control.dirty && !control.valid){
          const message=this.validationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.formErrors[field] += message[key] + '';
            }
          }
        }
      }

    }
  
  goBack(): void {
    this.location.back();
  }
  setPrevNext(dishId: number) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  

}
