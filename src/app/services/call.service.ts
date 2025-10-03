import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';

// REQ_07: Interface completa para a chamada
export interface Call {
  id: string;
  senha: string;
  guiche: string;
  especialidade: string;
  paciente: string;
  horario: string;
}

@Injectable({
  providedIn: 'root',
})
export class CallService {
  // Dados Mockados Fixos (para simular a fila de chamadas)
  private mockCalls: Call[] = [
    {
      id: '1',
      senha: 'CG-001P',
      paciente: 'J. HEBERT',
      especialidade: 'C. GERAL',
      guiche: 'Guichê 2',
      horario: '10:19',
    },
    {
      id: '2',
      senha: 'OD-002A',
      paciente: 'SARA INGRID',
      especialidade: 'ODONTO',
      guiche: 'Guichê 3',
      horario: '10:22',
    },
    {
      id: '3',
      senha: 'PE-005I',
      paciente: 'DAVI R.',
      especialidade: 'PEDIATRIA',
      guiche: 'Guichê 1',
      horario: '10:25',
    },
    {
      id: '4',
      senha: 'CA-003A',
      paciente: 'ANA SILVA',
      especialidade: 'CARDIO',
      guiche: 'Guichê 4',
      horario: '10:28',
    },
    {
      id: '5',
      senha: 'FO-002P',
      paciente: 'THAYNÁ T.',
      especialidade: 'FONO',
      guiche: 'Guichê 5',
      horario: '10:28',
    },
  ];

  private currentCallSubject = new BehaviorSubject<Call | null>(null);
  public currentCall$: Observable<Call | null> =
    this.currentCallSubject.asObservable();

  // CORREÇÃO: Inicializa o histórico como array vazio para o primeiro carregamento da página.
  private historySubject = new BehaviorSubject<Call[]>([]);
  public history$: Observable<Call[]> = this.historySubject.asObservable();

  private callTimerSubscription: Subscription | null = null;
  private mockIndex = 0;

  constructor() {}

  private getNextMockCall(): Call {
    const callData = this.mockCalls[this.mockIndex % this.mockCalls.length];
    this.mockIndex++;

    const now = new Date();
    const horarioFormatado = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      ...callData,
      id: Math.random().toString(36).substring(2, 9),
      horario: horarioFormatado,
      guiche: callData.guiche.toString(),
    } as Call;
  }

  // REQ_03: Método para disparar uma nova chamada (acionado pela tecla 'S')
  public triggerNextCall(): void {
    this.callTimerSubscription?.unsubscribe();
    const newCall = this.getNextMockCall();
    this.processNewCall(newCall);
  }

  private processNewCall(call: Call): void {
    // 1. Atualiza a chamada atual
    this.currentCallSubject.next(call);

    // 2. REQ_06: Atualiza o Histórico (o mais recente no topo)
    const currentHistory = this.historySubject.value;
    this.historySubject.next([call, ...currentHistory.slice(0, 4)]);

    // 3. REQ_04: Inicia o Timer de Retorno Automático (15 segundos)
    this.callTimerSubscription = timer(15000).subscribe(() => {
      this.returnToDefaultState();
    });
  }

  // REQ_04: Reseta o estado (Volta ao "Estado Padrão")
  public returnToDefaultState(): void {
    this.currentCallSubject.next(null);
    this.callTimerSubscription?.unsubscribe();
    this.callTimerSubscription = null;
  }
}
