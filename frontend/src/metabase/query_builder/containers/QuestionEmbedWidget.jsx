import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { t } from "ttag";

import Icon from "metabase/components/Icon";

import EmbedModalContent from "metabase/public/components/widgets/EmbedModalContent";

import * as Urls from "metabase/lib/urls";
import MetabaseSettings from "metabase/lib/settings";
import * as MetabaseAnalytics from "metabase/lib/analytics";

import { getParametersFromCard } from "metabase/meta/Card";
import {
  createPublicLink,
  deletePublicLink,
  updateEnableEmbedding,
  updateEmbeddingParams,
} from "../actions";

const QuestionEmbedWidgetPropTypes = {
  className: PropTypes.string,
  card: PropTypes.object,
  createPublicLink: PropTypes.func,
  deletePublicLink: PropTypes.func,
  updateEnableEmbedding: PropTypes.func,
  updateEmbeddingParams: PropTypes.func,
};

const QuestionEmbedWidgetTriggerPropTypes = {
  onClick: PropTypes.func,
};

const mapDispatchToProps = {
  createPublicLink,
  deletePublicLink,
  updateEnableEmbedding,
  updateEmbeddingParams,
};

@connect(
  null,
  mapDispatchToProps,
)
export default class QuestionEmbedWidget extends Component {
  render() {
    const {
      className,
      card,
      createPublicLink,
      deletePublicLink,
      updateEnableEmbedding,
      updateEmbeddingParams,
      ...props
    } = this.props;
    return (
      <EmbedModalContent
        {...props}
        className={className}
        resource={card}
        resourceType="question"
        resourceParameters={getParametersFromCard(card)}
        onCreatePublicLink={() => createPublicLink(card)}
        onDisablePublicLink={() => deletePublicLink(card)}
        onUpdateEnableEmbedding={enableEmbedding =>
          updateEnableEmbedding(card, enableEmbedding)
        }
        onUpdateEmbeddingParams={embeddingParams =>
          updateEmbeddingParams(card, embeddingParams)
        }
        getPublicUrl={({ public_uuid }, extension) =>
          Urls.publicQuestion(public_uuid, extension)
        }
        extensions={Urls.exportFormats}
      />
    );
  }

  static shouldRender({
    question,
    isAdmin,
    // preferably this would come from props
    isPublicLinksEnabled = MetabaseSettings.get("enable-public-sharing"),
    isEmbeddingEnabled = MetabaseSettings.get("enable-embedding"),
  }) {
    return (
      (isPublicLinksEnabled && (isAdmin || question.publicUUID())) ||
      (isEmbeddingEnabled && isAdmin)
    );
  }
}

export function QuestionEmbedWidgetTrigger({ onClick }) {
  return (
    <Icon
      name="share"
      tooltip={t`Sharing`}
      className="mx1 hide sm-show text-brand-hover cursor-pointer"
      onClick={() => {
        MetabaseAnalytics.trackStructEvent(
          "Sharing / Embedding",
          "question",
          "Sharing Link Clicked",
        );
        onClick();
      }}
    />
  );
}

QuestionEmbedWidgetTrigger.propTypes = QuestionEmbedWidgetTriggerPropTypes;
QuestionEmbedWidget.propTypes = QuestionEmbedWidgetPropTypes;
