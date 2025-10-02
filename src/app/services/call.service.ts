import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';

export interface Call {
  id: string;
  senha: string;
  medico: string;
  especialidade: string;
  guiche: number;
  horario: string;
}

@Injectable({
  providedIn: 'root'
})
export class CallService {
  private mockCalls: Call[] = [
    { id: '1', senha: "CG-001P", medico: "J. HEBERT", especialidade: "C. GERAL", guiche: 2, horario: "10:19" },
    { id: '2', senha: "OD-002A", medico: "SARA INGRID", especialidade: "ODONTO", guiche: 3, horario: "10:22" },
    { id: '3', senha: "PE-005I", medico: "DAVI R.", especialidade: "PEDIATRIA", guiche: 1, horario: "10:25" },
    { id: '4', senha: "CA-003A", medico: "ANA SILVA", especialidade: "CARDIO", guiche: 4, horario: "10:28" },
    { id: '5', senha: "FO-002P", medico: "THAYNÁ T.", especialidade: "FONO", guiche: 5, horario: "10:28" }
  ];

  // BehaviorSubject para o estado da chamada atual (null = Estado Padrão)
  private currentCallSubject = new BehaviorSubject<Call | null>(null);
  public currentCall$: Observable<Call | null> = this.currentCallSubject.asObservable();

  // BehaviorSubject para o histórico (inicia com dados mockados)
  private historySubject = new BehaviorSubject<Call[]>(this.mockCalls);
  public history$: Observable<Call[]> = this.historySubject.asObservable();

  private callTimerSubscription: Subscription | null = null;
  private mockIndex = 0;

  constructor() {
    // Timer de chamadas automáticas REMOVIDO para que só apareça sob demanda.
  }

  private getNextMockCall(): Call {
    const callData = this.mockCalls[this.mockIndex % this.mockCalls.length];
    this.mockIndex++;

    const now = new Date();
    const horarioFormatado = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return {
      ...callData,
      id: Math.random().toString(36).substring(2, 9), // ID único
      horario: horarioFormatado,
    };
  }

  /**
   * Dispara a próxima chamada da fila mockada (Nova Chamada).
   */
  public triggerNextCall(): void {
    this.callTimerSubscription?.unsubscribe();

    const newCall = this.getNextMockCall();
    this.processNewCall(newCall);
  }

  /**
   * Dispara a última chamada do histórico (Repetir Chamada).
   */
  public triggerLastCall(): void {
    const history = this.historySubject.value;
    if (history.length === 0) {
        console.warn("Não há chamadas no histórico para repetir.");
        return;
    }
    this.callTimerSubscription?.unsubscribe();

    // Cria um clone do último item para ter um novo ID/timestamp, se necessário.
    const lastCall = { ...history[0] }; 
    lastCall.id = Math.random().toString(36).substring(2, 9);
    lastCall.horario = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    this.processNewCall(lastCall);
  }

  /**
   * Lógica comum para processar e exibir uma chamada.
   */
  private processNewCall(call: Call): void {
      // 1. Atualiza o estado da chamada atual (Ativa o "Estado de Chamada")
      this.currentCallSubject.next(call);

      // 2. Atualiza o Histórico (A mais recente no topo) (REQ_06)
      const currentHistory = this.historySubject.value;
      // Adiciona apenas se não for uma repetição exata no histórico (opcional)
      this.historySubject.next([call, ...currentHistory.slice(0, 4)]); 

      // 3. Inicia o Timer de Retorno Automático (15 segundos) (REQ_04)
      this.callTimerSubscription = timer(15000).subscribe(() => {
          this.resetCallState();
      });
  }

  /**
   * Reseta o estado da chamada (Volta ao "Estado Padrão").
   */
  public resetCallState(): void {
    this.currentCallSubject.next(null);
    this.callTimerSubscription?.unsubscribe();
    this.callTimerSubscription = null;
  }
}
