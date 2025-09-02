import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/core/project-interfaces/interfaces';

@Component({
  selector: 'app-product-classes',
  templateUrl: './product-classes.component.html',
  styleUrls: ['./product-classes.component.scss'],
})
export class ProductClassesComponent implements OnInit {

  @Input('prod') prod: Product

  constructor() { }

  ngOnInit() { }

}
