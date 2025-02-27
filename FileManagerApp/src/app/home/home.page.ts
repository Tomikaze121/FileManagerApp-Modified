import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

interface FileItem {
  name: string;
  content: string;
}

@Component({
  standalone:false,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  fileName: string = '';
  fileContent: string = '';
  fileList: FileItem[] = [];
  isEditing: boolean = false;
  selectedFileIndex: number | null = null;

  constructor(private storage: Storage) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
    this.loadFiles();
  }

  async loadFiles() {
    const storedFiles = await this.storage.get('files');
    if (storedFiles) {
      this.fileList = storedFiles;
    }
  }

  async saveOrUpdateFile() {
    if (!this.fileName.trim() || !this.fileContent.trim()) return;

    if (this.isEditing && this.selectedFileIndex !== null) {
      this.fileList[this.selectedFileIndex] = { name: this.fileName, content: this.fileContent };
      this.isEditing = false;
      this.selectedFileIndex = null;
    } else {
      this.fileList.push({ name: this.fileName, content: this.fileContent });
    }

    await this.storage.set('files', this.fileList);
    this.clearForm();
  }

  editFile(index: number) {
    this.fileName = this.fileList[index].name;
    this.fileContent = this.fileList[index].content;
    this.isEditing = true;
    this.selectedFileIndex = index;
  }

  async deleteFile(index: number) {
    this.fileList.splice(index, 1);
    await this.storage.set('files', this.fileList);
  }

  clearForm() {
    this.fileName = '';
    this.fileContent = '';
  }
}
