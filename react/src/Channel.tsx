import * as React from "react";
import { match } from "react-router-dom";
import { MessageFeed, MessageForm } from "./component";

interface ChannelMatch {
  channelName: string;
}

interface ChannelProps {
  match: match<ChannelMatch>;
}

interface ChannelStates {
  shouldReload: boolean;
}

export class Channel extends React.Component<ChannelProps, ChannelStates> {
  constructor(props: ChannelProps) {
    super(props);
    this.state = {
      shouldReload: false
    };
  }
  private setShouldReload = (shouldReload: boolean) => {
    this.setState({
      shouldReload
    });
  };
  private fetchMessages = () => {};
  public render() {
    const { channelName } = this.props.match.params;
    return [
      <MessageFeed
        key="feed"
        channelName={channelName}
        setShouldReload={this.setShouldReload}
        shouldReload={this.state.shouldReload}
      />,
      <MessageForm
        key="form"
        channelName={channelName}
        setShouldReload={this.setShouldReload}
      />
    ];
  }
}
