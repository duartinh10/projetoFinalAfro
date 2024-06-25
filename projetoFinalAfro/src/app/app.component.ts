import { CommonModule, AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

interface Gener {
  id: number;
  name: string;
}

interface State {
  id: number;
  name: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, AsyncPipe, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userObj: Partial<USER> = {}; // Use Partial para não exigir todos os campos
  http = inject(HttpClient);
  genero$: Observable<Gener[]> = new Observable<Gener[]>();
  stateList$: Observable<State[]> = new Observable<State[]>();
  userList: USER[] = [];
  mostrarNovoUsuario: boolean = true;

  ngOnInit(): void {
    this.genero$ = this.http.get<Gener[]>("http://localhost:3000/genero");
    this.stateList$ = this.http.get<State[]>("http://localhost:3000/stateList");
    this.getUsers();
  }
  
  

  onFechar() {
    console.log("O botão foi clicado!");
    this.mostrarNovoUsuario = false; // Esconde a seção de Novo Usuário
  }

  onAbrir() {
    this.mostrarNovoUsuario = true; // Mostra a seção de Novo Usuário
  }

  getUsers() {
    this.http.get<USER[]>("http://localhost:3000/userList").subscribe((res: USER[]) => {
      this.userList = res;
    });
  }

  onSaveUser() {
    const newUser = { 
      ...this.userObj, 
      id: Math.floor(Math.random() * 1000000),  // Gera um id aleatório
      userId: Math.floor(Math.random() * 1000000)  // Gera um userId aleatório
    }; 

    this.http.post<USER>("http://localhost:3000/userList", newUser).subscribe((res: USER) => {
      alert("Criado com sucesso");
      this.userList.unshift(res); // Adiciona o usuário criado com o id gerado automaticamente
      this.clearForm();
      this.userObj = {}; // Limpa o formulário após salvar
    });
  }

  onEdit(data: USER) {
    this.userObj = data;
    this.mostrarNovoUsuario = true; // Mostra a seção de Novo Usuário
  }

  onDelete(id: number) {
    const isDelete = confirm("Você quer deletar?");
    if (isDelete) {
      this.http.delete(`http://localhost:3000/userList/${id}`).subscribe(() => {
        alert("Deletado com sucesso");
        this.userList = this.userList.filter(user => user.id !== id); // Filtra pelo campo correto
      },
      (error) => {
        console.error("Error deleting user:", error);
      });
    }
  }

  clearForm(): void {
    this.userObj = { fName: '', lName: '', userName: '', city: '', state: '' };
    //this.isEditing = false;
  }
}


export class USER {
  userId: number;
  userName: string;
  fName: string;
  lName: string;
  city: string;
  state: string;
  zipCode: string;
  id: number;
  constructor() {
    this.userId = 0;
    this.userName = '';
    this.fName = '';
    this.lName = '';
    this.city = '';
    this.state = '';
    this.zipCode = '';
    this.id = 0;
  }
}
