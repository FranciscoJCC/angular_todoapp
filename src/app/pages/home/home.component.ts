import { Component, Injector, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

import { Task } from '../../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([]);

  /* Filtro */
  filter = signal<'all' | 'pending' | 'completed'>('all');
  //Valor computed de las tareas, para agregar filtro
  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();

    if(filter  === 'pending'){
      return tasks.filter(task => !task.completed)
    }
    if(filter === 'completed'){
      return tasks.filter(task => task.completed)
    }

    return tasks;
  });

  /* Formulario */
  newTaskCtrl = new FormControl('',{
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern('^\\S.*$'),
      Validators.minLength(3),
    ]
  });

  //Cuando se inicializa el componente 
  ngOnInit(){
    const storage =  localStorage.getItem('tasks');
    console.log(storage);
    if(storage){
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
  }

  trackTasks(){

  }

  //Se ejecuta cada vez que cambia el estado del componente
  //injector  = inject(Injector)
  
  constructor() {
    effect(() => {
      const tasks = this.tasks();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    })
  }

  changeHandler() {
    //validamos que el formulario cumpla con los requisitos
    if(this.newTaskCtrl.valid){
      //const value = this.newTaskCtrl.value;
      this.addTask(this.newTaskCtrl.value.trim()); // añadimos la tarea al array
      this.newTaskCtrl.setValue(''); //Limpiamos el input
    }

  }

  addTask(title : string){
    const newTask = {
      id: Date.now(),
      title,
      completed: false
    };

    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  completedTask(index : Number){
    this.tasks.update((tasks) => 
      tasks.map((task, position) => {
        if(position === index){
          task.completed = !task.completed;
        }
        return task;
    })
    );
  }

  deleteTask(index: number){
    this.tasks.update((tasks) => tasks.filter((task, position) => position !== index));
  }

  //Actualizamos el estado a editar, para modificar el titulo
  updateTasktEditingMode(index: number){
    this.tasks.update(prevState => {
      return prevState.map((task, position) => {
        if(position === index){
          return {
            ...task,
            editing: true
          }
        }
        return {
          ...task,
          editing: false
        };
      });
    }) 
  }

  //Actualizamos el estado a editar, para modificar el titulo
  updateTitleTask(index: number, event : Event){
    const input = event.target as HTMLInputElement;

    this.tasks.update(prevState => {
      return prevState.map((task, position) => {
        if(position === index){
          return {
            ...task,
            title: input.value,
            editing: false
          }
        }
        return task;
      });
    }) 
  }

  changeFilter(filter : 'all' | 'pending' | 'completed'){
    this.filter.set(filter);
  }
}
