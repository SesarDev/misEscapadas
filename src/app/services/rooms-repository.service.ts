import { Injectable, inject } from '@angular/core';
import { Firestore, Timestamp, collection, collectionData, deleteDoc, doc, getDocs, orderBy, query, setDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EscapeRoom } from '../models/escape-room.model';
import { DEMO_ESCAPE_ROOMS } from './demo-seed';
import { hasFirebaseConfig } from '../core/firebase/firebase-utils';
import { environment } from '@env/environment';
import { roomFromStorage, roomToStorage } from './room-helpers';

const STORAGE_KEY = 'mis-escapadas.rooms';

@Injectable({ providedIn: 'root' })
export class RoomsRepositoryService {
  private readonly firestore = inject(Firestore, { optional: true });
  private readonly useFirebase = hasFirebaseConfig(environment.firebase);

  watchRooms(): Observable<EscapeRoom[]> {
    if (!this.useFirebase || !this.firestore) {
      return of(this.readLocal());
    }

    const roomsRef = query(collection(this.firestore, 'escapeRooms'), orderBy('meta.updatedAt', 'desc'));
    return collectionData(roomsRef, { idField: 'id' }).pipe(
      map((rooms) => rooms.map((room) => this.fromFirestore(room as Record<string, unknown>))),
      catchError((error) => {
        console.error('No se pudieron leer salas desde Firestore. Se usará almacenamiento local.', error);
        return of(this.readLocal());
      })
    );
  }

  async saveRoom(room: EscapeRoom): Promise<void> {
    if (!this.useFirebase || !this.firestore) {
      this.saveLocalRoom(room);
      return;
    }

    try {
      await setDoc(doc(this.firestore, 'escapeRooms', room.id), this.toFirestore(room));
    } catch (error) {
      console.error('No se pudo guardar en Firestore. Se guardará en local.', error);
      this.saveLocalRoom(room);
    }
  }

  async deleteRoom(id: string): Promise<void> {
    if (!this.useFirebase || !this.firestore) {
      this.deleteLocalRoom(id);
      return;
    }

    try {
      await deleteDoc(doc(this.firestore, 'escapeRooms', id));
    } catch (error) {
      console.error('No se pudo borrar en Firestore. Se borrará en local.', error);
      this.deleteLocalRoom(id);
    }
  }

  async seedDemoData(force = false): Promise<void> {
    if (!this.useFirebase || !this.firestore) {
      if (force || !this.readLocal().length) {
        this.writeLocal(DEMO_ESCAPE_ROOMS);
      }
      return;
    }

    const firestore = this.firestore;
    try {
      const snapshot = await getDocs(collection(firestore, 'escapeRooms'));
      if (!force && !snapshot.empty) {
        return;
      }

      if (force) {
        await Promise.all(snapshot.docs.map((room) => deleteDoc(room.ref)));
      }

      await Promise.all(DEMO_ESCAPE_ROOMS.map((room) => setDoc(doc(firestore, 'escapeRooms', room.id), this.toFirestore(room))));
    } catch (error) {
      console.error('No se pudo sembrar Firestore. Se usarán datos locales.', error);
      if (force || !this.readLocal().length) {
        this.writeLocal(DEMO_ESCAPE_ROOMS);
      }
    }
  }

  async clearDemoData(): Promise<void> {
    if (!this.useFirebase || !this.firestore) {
      this.writeLocal([]);
      return;
    }

    try {
      const snapshot = await getDocs(collection(this.firestore, 'escapeRooms'));
      await Promise.all(snapshot.docs.map((entry) => deleteDoc(entry.ref)));
    } catch (error) {
      console.error('No se pudo limpiar Firestore. Se limpiará local.', error);
      this.writeLocal([]);
    }
  }

  private readLocal(): EscapeRoom[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      return (JSON.parse(raw) as Record<string, unknown>[]).map((item) => roomFromStorage(item));
    } catch {
      return [];
    }
  }

  private writeLocal(rooms: EscapeRoom[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms.map((room) => roomToStorage(room))));
  }

  private saveLocalRoom(room: EscapeRoom): void {
    const rooms = this.readLocal();
    const next = [...rooms.filter((entry) => entry.id !== room.id), room];
    this.writeLocal(next);
  }

  private deleteLocalRoom(id: string): void {
    this.writeLocal(this.readLocal().filter((room) => room.id !== id));
  }

  private toFirestore(room: EscapeRoom): Record<string, unknown> {
    return {
      ...room,
      playedAt: room.playedAt ? Timestamp.fromDate(room.playedAt) : null,
      meta: {
        createdAt: Timestamp.fromDate(room.meta.createdAt),
        updatedAt: Timestamp.fromDate(room.meta.updatedAt)
      }
    };
  }

  private fromFirestore(room: Record<string, unknown>): EscapeRoom {
    const meta = room['meta'] as { createdAt: Timestamp; updatedAt: Timestamp };
    return {
      ...(room as unknown as EscapeRoom),
      playedAt: room['playedAt'] ? (room['playedAt'] as Timestamp).toDate() : null,
      meta: {
        createdAt: meta.createdAt.toDate(),
        updatedAt: meta.updatedAt.toDate()
      }
    };
  }
}
