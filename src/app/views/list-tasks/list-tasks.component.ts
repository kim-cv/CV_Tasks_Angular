import { Component, OnInit, ViewChild } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faSurprise } from '@fortawesome/free-regular-svg-icons';
import { BtnLaddaComponent, BtnStates } from 'src/app/components/btn-ladda/btn-ladda.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ITask } from 'src/app/models/task/ITask';
import { BackendService } from 'src/app/services/backend-service/backend.service';
import { AngularFireAuth } from '@angular/fire/auth';

import { of } from 'rxjs';
import { take, finalize, catchError } from 'rxjs/operators';
import { SpinnerService } from 'src/app/components/loading-spinner/spinner-service';
import { listAnimation, simpleFadeAnimation } from 'src/app/animations/animations';



@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss'],
  animations: [listAnimation, simpleFadeAnimation]
})
export class ListTasksComponent implements OnInit {

  @ViewChild('btnCreateTask') btnCreateTask: BtnLaddaComponent;

  // Formgroup
  public formgroupAddTask: FormGroup;

  public icon_faBars = faBars;
  public icon_surprise = faSurprise;

  // Contains whether a certain task description has been expanded or not
  public expandStates: {
    taskUid: string,
    state: 'OPEN' | 'CLOSED'
  }[] = [];

  public tasks: ITask[] = [];
  // Converts to true when we have received a result from backend with a list of user tasks
  public isLoadingComplete = false;

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private afAuth: AngularFireAuth,
    private spinnerService: SpinnerService) {

    // Make formgroup
    this.formgroupAddTask = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[ a-zA-Z0-9æøåÆØÅ\n.,]+$'), Validators.minLength(0), Validators.maxLength(30)]],
      description: ['', [Validators.required, Validators.pattern('^[ a-zA-Z0-9æøåÆØÅ\n.,]+$'), Validators.minLength(0), Validators.maxLength(250)]]
    });
  }

  async ngOnInit() {
    const currentUserTasks = await this.RetrieveUserTasks();

    currentUserTasks.subscribe(
      tasksArr => {
        // Add tasks to arr
        this.tasks.push(...tasksArr);

        // Construct task expand states
        this.tasks.forEach(tmpTask => this.AddTaskState(tmpTask.uid));
      }
    );
  }

  private async RetrieveUserTasks() {
    if (this.afAuth.auth.currentUser !== null) {
      const token = await this.afAuth.auth.currentUser.getIdToken();

      return this.backendService
        .user
        .tasks
        .list(token)
        .pipe(
          take(1),
          finalize(() => { this.spinnerService.hide('loadSpinnerTasks'); this.isLoadingComplete = true; }),
          catchError(err => {
            console.error('Backend Error', err);
            return of([] as ITask[]);
          })
        );
    } else {
      console.error('RetrieveUserTasks() - Could not retrieve user token.');
    }
  }

  private async CreateTask(name: string, description: string) {
    if (this.afAuth.auth.currentUser !== null) {
      const token = await this.afAuth.auth.currentUser.getIdToken();

      let task: ITask;
      try {
        task = await this.backendService
          .user
          .tasks
          .create(token, name, description)
          .toPromise();
      } catch (err) {
        console.error('Unknown error at CreateTask().', err);
        throw new Error('Unknown error at CreateTask().');
      }

      // Add new task to front of array
      this.tasks.unshift(task);
      this.AddTaskState(task.uid);
    } else {
      console.error('CreateTask() - Could not retrieve user token.');
      throw new Error('CreateTask() - Could not retrieve user token.');
    }
  }

  private AddTaskState(taskUid: string) {
    this.expandStates.push({
      taskUid: taskUid,
      state: 'CLOSED'
    });
  }

  private async DeleteTask(taskUid: string) {
    if (this.afAuth.auth.currentUser !== null) {
      const token = await this.afAuth.auth.currentUser.getIdToken();

      try {
        await this.backendService
          .user
          .tasks
          .delete(token, taskUid)
          .toPromise();
      } catch (err) {
        console.error('Unknown error at DeleteTask().', err);
        throw new Error('Unknown error at DeleteTask().');
      }

      // Remove task from arr
      const taskIndex = this.tasks.findIndex(task => task.uid === taskUid);
      if (taskIndex > -1) {
        this.tasks.splice(taskIndex, 1);
      }

      // Remove expand state
      const stateIndex = this.expandStates.findIndex(state => state.taskUid === taskUid);
      if (stateIndex > -1) {
        this.expandStates.splice(stateIndex, 1);
      }
    } else {
      console.error('DeleteTask() - Could not retrieve user token.');
      throw new Error('DeleteTask() - Could not retrieve user token.');
    }
  }

  private GetExpandStateOnTaskId(taskUid: string) {
    return this.expandStates.find(state => state.taskUid === taskUid);
  }

  // #region Methods called by view
  public HTMLGetExpandState(task: ITask) {
    return this.GetExpandStateOnTaskId(task.uid);
  }

  public HTMLExpandToggle(task: ITask, _event: MouseEvent) {
    // Stop link click from refreshing page
    _event.preventDefault();

    const expandState = this.GetExpandStateOnTaskId(task.uid);
    if (expandState.state === 'CLOSED') {
      expandState.state = 'OPEN';
    } else {
      expandState.state = 'CLOSED';
    }
  }

  public async HTMLCreateTask() {
    this.formgroupAddTask.disable();
    this.btnCreateTask.Start();

    // Force re-validate on submit
    Object.keys(this.formgroupAddTask.controls).forEach(field => {
      const control = this.formgroupAddTask.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
        control.updateValueAndValidity();
      }
    });

    if (this.formgroupAddTask.invalid) {
      this.formgroupAddTask.enable();
      this.btnCreateTask.Stop();
      this.btnCreateTask.SetStateBeforeAndAfterWithDuration(BtnStates.danger, BtnStates.secondary, 1500);
      return;
    }

    // TODO: make into custom formgroup validator and show field validation errors
    const name: string = this.formgroupAddTask.get('name').value;
    if (name.trim().length <= 0) {
      this.formgroupAddTask.get('name').setErrors({ lengthTooShort: 'true' });
      return;
    }

    const description: string = this.formgroupAddTask.get('description').value;
    if (description.trim().length <= 0) {
      this.formgroupAddTask.get('description').setErrors({ lengthTooShort: 'true' });
      return;
    }

    try {
      await this.CreateTask(name, description);
      this.btnCreateTask.SetStateBeforeAndAfterWithDuration(BtnStates.success, BtnStates.secondary, 1000);
    } catch (err) {
      this.btnCreateTask.SetStateBeforeAndAfterWithDuration(BtnStates.danger, BtnStates.secondary, 1000);
    }

    this.btnCreateTask.Stop();
    setTimeout(() => {
      this.formgroupAddTask.enable();
      this.formgroupAddTask.reset();
    }, 1000);
  }

  public async HTMLDeleteTask(task: ITask, _event: MouseEvent) {
    // Stop link click from refreshing page
    _event.preventDefault();

    try {
      await this.DeleteTask(task.uid);
    } catch (err) {
    }
  }
  // #endregion
}
