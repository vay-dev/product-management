import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'searchTodos' })
export class SearchTodosPipe implements PipeTransform {
  transform(todos: any[], search: string): any[] {
    if (!todos || !search) return todos;
    search = search.toLowerCase();
    return todos.filter((todo) => todo.title.toLowerCase().includes(search));
  }
}
