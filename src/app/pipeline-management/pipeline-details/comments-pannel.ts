import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { BehaviorSubject, concat, Observable, of, timer } from "rxjs";
import { concatMapTo, switchMap } from "rxjs/operators";

// Material
import { MatExpansionPanel } from "@angular/material/expansion";

// Services
import { CommentsService } from "../../services/comments.service";

// Models
import {
  ContextTypeReferenceData,
  ConversationContextLineage,
  IComment,
  IConversation,
} from "../../models";

// Utility
import { pollingRequest } from "../../../../shared/utility/polling-request";

@Component({
  selector: "mf-pe-comments-panel",
  templateUrl: "./comments-panel.component.html",
  styleUrls: ["./comments-panel.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsPanelComponent implements OnInit {
  @ViewChild("commentsPanel", { static: true })
  commentsPanel: MatExpansionPanel;

  @HostBinding("class.comments-panel") hostClass = true;

  @HostBinding("class.panel-expanded")
  get expanded() {
    return this.commentsPanel.expanded;
  }

  @HostBinding("class.panel-collapsed")
  get collapsed() {
    return !this.commentsPanel.expanded;
  }

  @Input() panelId: string;

  @Input() activeOpportunityId: string;

  @Input() activeQuoteId: string;

  @Input() contextLineageStatus: string;

  @Input() subHeaderText = "";

  @Input() contextTypeRefData: ContextTypeReferenceData[] = [];

  @Input() senderGroupColorsRefData: { [key: string]: string } = null;

  commentsPanelForm: FormGroup = new FormGroup({});

  pollingForComments$: Observable<IConversation[]>;
  updPollingForComments$: BehaviorSubject<
    IConversation[] | null
  > = new BehaviorSubject<IConversation[] | null>(null);

  // ------------------------------ Getters - Form ------------------------------

  get commentText(): FormControl {
    return this.commentsPanelForm.get("commentText") as FormControl;
  }

  get contextType(): FormControl {
    return this.commentsPanelForm.get("contextType") as FormControl;
  }

  // ------------------------------ Init ------------------------------

  constructor(
    private commentsService: CommentsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.openPollingForCommentsStream();

    this.commentsService.contextStatus = this.contextLineageStatus;
    this.commentsService.contextTypeRefData = this.contextTypeRefData.slice();
    this.commentsService.senderGroupColorsRefData = this.senderGroupColorsRefData;

    this.createForm();
  }

  // ------------------------------ Handle Form ------------------------------

  // This will take care of initializing the base FormGroup for the Comments panel
  createForm() {
    this.commentsPanelForm = this.fb.group({
      commentText: [""],
      contextType: [this.contextTypeRefData[0] || null],
    });
  }

  // This will take care of resetting the base FormGroup back to its orignial state
  resetForm() {
    this.commentsPanelForm.reset();
    this.contextType.setValue(this.contextTypeRefData[0] || null);
  }

  // ------------------------------ Add Comment ------------------------------

  // This will set up a new request for creating a new comment (thread)
  addComment() {
    const contextTypeValue: ContextTypeReferenceData = this.contextType.value;

    const newCommentReq: IComment = {
      commentType: !!contextTypeValue ? contextTypeValue.value : null,
      content: this.commentText.value,
      conversationId: "",
      lastModifiedDateTime: "",
      messageId: "",
      opportunityId: this.activeOpportunityId,
      quoteId: this.activeQuoteId,
      timeCommentSubmitted: "",
    };

    // TODO: Handle error state after requirements are defined, no ETA yet
    this.commentsService.addComment(newCommentReq).subscribe(
      (comments: IConversation[]) => {
        this.updPollingForComments$.next(comments);
        this.resetForm();
      },
      (error) => console.error(error)
    );
  }

  // ------------------------------------------------------------

  // This will set up our subscription to the getAllComments API to poll for updated comments
  private openPollingForCommentsStream() {
    this.pollingForComments$ = this.updPollingForComments$.asObservable().pipe(
      switchMap<IConversation[] | null, Observable<IConversation[]>>(
        (updComments: IConversation[] | null) => {
          const contextLineageObj: ConversationContextLineage = {
            opportunityId: this.activeOpportunityId,
            quoteId: this.activeQuoteId,
          };

          const pollingInterval = 30000;
          const pollingStream$: Observable<IConversation[]> = pollingRequest(
            this.commentsService.getAllComments(contextLineageObj),
            pollingInterval
          );
          const delayedStream$ = timer(pollingInterval).pipe(
            concatMapTo(pollingStream$)
          );
          return !!updComments
            ? concat(of(updComments), delayedStream$)
            : pollingStream$;
        }
      )
    );

    this.updPollingForComments$.next(null);
  }
}
