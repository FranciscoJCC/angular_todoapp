import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome = 'Holaa!';
  tasks = signal([
    'Instalar CLI',
    'Crear proyecto',
    'Crear componentes'
  ]);

  name = signal('Francisco Candelario');
  age = 18;
  image = 'https://cdn1.coppel.com/images/catalog/pm/5522013-360-12.jpg';
  disabled = true;

  person = signal({
    name : 'Francisco Candelario',
    age : 20,
    image : 'https://www.w3schools.com/howto/img_avatar.png'
  });

  /* Formularios */
  colorCtrl = new FormControl();
  widthCtrl = new FormControl(50,{ //50, valor inicial
    nonNullable: true,
  });

  nameCtrl = new FormControl('Francisco', {
    nonNullable: true,
    validators: [
      Validators.required, 
      Validators.minLength(3)
    ]
  });

  constructor() {
    this.colorCtrl.valueChanges.subscribe(value => {
      console.log(value);
    })
  }

  clickHandler(){
    alert("Hola!")
  }

  changeHandler(event : Event){
    console.log(event);
  }

  keyBoardEvent(event : KeyboardEvent){
    const input = event.target as HTMLInputElement;
    console.log(input.value);
  }

  changeName(event : Event){
    const input = event.target as HTMLInputElement;
    const  newValue = input.value; 
    this.name.set(newValue);
  }

  changeNamePerson(event : Event){
    const input = event.target as HTMLInputElement;
    const newName = input.value;

    this.person.update(prevState => {
      return {
        ...prevState,
        name : newName
      }
    })
  }

  changeAge(event : Event){
    const input = event.target as HTMLInputElement;
    const newAge = input.value;

    this.person.update(prevState => {
      return {
        ...prevState,
        age: parseInt(newAge)
      }
    })
  }


}
