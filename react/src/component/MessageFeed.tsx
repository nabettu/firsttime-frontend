import * as React from "react";
import { fetchMessages, Message } from "../client";
import { Segment, Image, Comment, Header } from "semantic-ui-react";

interface MessageFeedProps {
  channelName: string;
  shouldReload: boolean;
  setShouldReload: (shouldReload: boolean) => void;
}

interface MessageFeedState {
  messages: Message[];
}

export class MessageFeed extends React.Component<
  MessageFeedProps,
  MessageFeedState
> {
  constructor(props: MessageFeedProps) {
    super(props);
    this.state = {
      messages: [
        {
          id: "a",
          user: {
            name: "aaa"
          },
          body: "aaaa"
        }
      ]
    };
  }

  public componentDidMount() {
    this.fetchMessages(this.props.channelName);
  }

  public componentDidUpdate(prevProps: MessageFeedProps) {
    if (
      prevProps.channelName != this.props.channelName ||
      (!prevProps.shouldReload && this.props.shouldReload)
    ) {
      this.fetchMessages(this.props.channelName);
    }
  }

  private fetchMessages = (channelName: string) => {
    this.props.setShouldReload(false);
    fetchMessages(channelName)
      .then(responce => {
        this.setState({
          messages: responce.data.messages
        });
      })
      .catch(console.log);
  };

  public render() {
    return (
      <Comment.Group>
        <Header as="h3" dividing>
          {this.props.channelName}
        </Header>
        {this.state.messages
          .slice()
          .reverse()
          .map(message => {
            return (
              <Comment key={message.id}>
                <Comment.Avatar
                  src={
                    message.user.avatar ||
                    "https://pbs.twimg.com/profile_images/979589819847262208/y3-HUfZq_bigger.jpg"
                  }
                />
                <Comment.Content>
                  <Comment.Author as="a">{message.user.name}</Comment.Author>
                  <Comment.Metadata>
                    <div>{message.date}</div>
                  </Comment.Metadata>
                  <Comment.Text>{message.body}</Comment.Text>
                </Comment.Content>
              </Comment>
            );
          })}
      </Comment.Group>
    );
  }
}
