import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { loadPlaylistTracks } from "../redux/actions";
import { RootState } from "../redux/state";

interface TagPageParams {
  id: string;
}

const connector = connect((state: RootState, ownProps: RouteComponentProps<TagPageParams>) => ({
  tags: state.trackTags
}), { loadPlaylistTracks });

const TagsPage = (props: RouteComponentProps<TagPageParams> & ConnectedProps<typeof connector>) => {
  return <>Hei</>;
}

export default connector(TagsPage);
