import { Component } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionSheetController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage {
  fileName: string = '';
  fileContent: string = '';
  fileList: string[] = [];

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  async saveOrUpdateFile() {
    if (!this.fileName) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Please enter a file name.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      await Filesystem.writeFile({
        path: this.fileName,
        data: this.fileContent,
        directory: Directory.Documents
      });

      const successAlert = await this.alertCtrl.create({
        header: 'Success',
        message: 'File saved/updated successfully!',
        buttons: ['OK']
      });
      await successAlert.present();

      this.loadFileList();
    } catch (error) {
      console.error('Error saving/updating file', error);
    }
  }

  async loadFileList() {
    try {
      const result = await Filesystem.readdir({
        path: '',
        directory: Directory.Documents
      });
      this.fileList = result.files.map(file => file.name);
    } catch (error) {
      console.error('Error reading files', error);
    }
  }

  async deleteFile(file: string) {
    try {
      await Filesystem.deleteFile({
        path: file,
        directory: Directory.Documents
      });

      const alert = await this.alertCtrl.create({
        header: 'Deleted',
        message: 'File deleted successfully!',
        buttons: ['OK']
      });
      await alert.present();

      this.loadFileList();
    } catch (error) {
      console.error('Error deleting file', error);
    }
  }

  async openFile(file: string) {
    try {
      const contents = await Filesystem.readFile({
        path: file,
        directory: Directory.Documents
      });

      if (typeof contents.data === 'string') {
        this.fileContent = contents.data;
      } else if (contents.data instanceof Blob) {
        this.fileContent = await contents.data.text();
      }

      this.fileName = file;

      const alert = await this.alertCtrl.create({
        header: 'Success',
        message: 'File loaded successfully!',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      console.error('Error reading file', error);
    }
  }

  async editFile(file: string) {
    const alert = await this.alertCtrl.create({
      header: 'Edit File Name',
      inputs: [
        {
          name: 'newFileName',
          type: 'text',
          value: file,
          placeholder: 'Enter new file name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: async (data) => {
            if (data.newFileName && data.newFileName !== file) {
              try {
                const fileContent = await Filesystem.readFile({
                  path: file,
                  directory: Directory.Documents
                });

                await Filesystem.writeFile({
                  path: data.newFileName,
                  data: fileContent.data,
                  directory: Directory.Documents
                });

                await Filesystem.deleteFile({
                  path: file,
                  directory: Directory.Documents
                });

                const successAlert = await this.alertCtrl.create({
                  header: 'Renamed',
                  message: 'File renamed successfully!',
                  buttons: ['OK']
                });
                await successAlert.present();

                this.loadFileList();
              } catch (error) {
                console.error('Error renaming file', error);
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async openActionSheet(file: string) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'File Options',
      buttons: [
        {
          text: 'Open',
          handler: () => this.openFile(file)
        },
        {
          text: 'Edit Name',
          handler: () => this.editFile(file)
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.deleteFile(file)
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  ionViewWillEnter() {
    this.loadFileList();
  }
}
