import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {
  private fileListSource = new BehaviorSubject<{ name: string, content: string }[]>([]);
  fileList$ = this.fileListSource.asObservable();

  constructor() {
    this.loadFiles();
  }

  private loadFiles() {
    const storedFiles = JSON.parse(localStorage.getItem('files') || '[]');
    this.fileListSource.next(storedFiles);
  }

  saveFile(name: string, content: string) {
    let files = this.fileListSource.getValue();
    const existingFile = files.find(file => file.name === name);

    if (existingFile) {
      existingFile.content = content;  // Update content
    } else {
      files.push({ name, content });
    }

    this.fileListSource.next(files);
    localStorage.setItem('files', JSON.stringify(files));
  }

  deleteFile(name: string) {
    let files = this.fileListSource.getValue().filter(file => file.name !== name);
    this.fileListSource.next(files);
    localStorage.setItem('files', JSON.stringify(files));
  }

  getFileContent(name: string): string {
    return this.fileListSource.getValue().find(file => file.name === name)?.content || '';
  }
}
