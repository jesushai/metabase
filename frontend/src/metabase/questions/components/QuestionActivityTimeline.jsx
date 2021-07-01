import React from "react";
import PropTypes from "prop-types";
import { t } from "ttag";
import { connect } from "react-redux";
import _ from "underscore";

import { revertToRevision } from "metabase/query_builder/actions";
import { getRevisionEventsForTimeline } from "metabase/lib/revisions";
import User from "metabase/entities/users";
import Revision from "metabase/entities/revisions";
import Timeline from "metabase/components/Timeline";
import {
  SidebarSectionHeader,
  RevertButton,
} from "./QuestionActivityTimeline.styled";

QuestionActivityTimeline.propTypes = {
  question: PropTypes.object,
  className: PropTypes.string,
  revisions: PropTypes.array,
  revertToRevision: PropTypes.func.isRequired,
  users: PropTypes.array,
};

function QuestionActivityTimeline({
  question,
  className,
  revisions,
  revertToRevision,
  users,
}) {
  const canWrite = question.canWrite();
  const revisionEvents = getRevisionEventsForTimeline(revisions, canWrite);

  return (
    <div className={className}>
      <SidebarSectionHeader>{t`Activity`}</SidebarSectionHeader>
      <Timeline
        items={revisionEvents}
        renderFooter={item => {
          const { isRevertable, revision } = item;
          if (isRevertable) {
            return (
              <RevisionEventFooter
                revision={revision}
                onRevisionClick={revertToRevision}
              />
            );
          }
        }}
      />
    </div>
  );
}

export default _.compose(
  User.loadList(),
  Revision.loadList({
    query: (state, props) => ({
      model_type: "card",
      model_id: props.question.id(),
    }),
    wrapped: true,
  }),
  connect(
    null,
    {
      revertToRevision,
    },
  ),
)(QuestionActivityTimeline);

RevisionEventFooter.propTypes = {
  revision: PropTypes.object.isRequired,
  onRevisionClick: PropTypes.func.isRequired,
};

function RevisionEventFooter({ revision, onRevisionClick }) {
  return (
    <div>
      <RevertButton
        actionFn={() => onRevisionClick(revision)}
        normalText={t`Revert back`}
        activeText={t`Reverting…`}
        failedText={t`Revert failed`}
        successText={t`Reverted`}
      />
    </div>
  );
}
