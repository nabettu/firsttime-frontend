import * as React from "react";
import { postMessage, Message } from "../client";
import { Button, Form, Segment, TextArea } from "semantic-ui-react";

interface MessageFormProps {
  channelName: string;
  setShouldReload: (shouldReload: boolean) => void;
}

interface MessageFormState {
  body?: string;
}

export class MessageForm extends React.Component<
  MessageFormProps,
  MessageFormState
> {
  constructor(props: MessageFormProps) {
    super(props);
    this.state = {
      body: ""
    };
    this.handleTextAreachange = this.handleTextAreachange.bind(this);
    this.handleSubmitMessage = this.handleSubmitMessage.bind(this);
  }

  private handleTextAreachange(event: React.FormEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    this.setState({
      body: event.currentTarget.value
    });
  }

  private handleSubmitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      body: this.state.body
    } as Message;

    postMessage(this.props.channelName, payload).then(e => {
      this.setState({
        body: ""
      });
      this.props.setShouldReload(true);
    });
  }

  public render() {
    return (
      <Segment basic textAlign="center">
        <Form onSubmit={this.handleSubmitMessage}>
          <Form.Field>
            <TextArea
              autoHeight
              placeholder="write your message"
              value={this.state.body}
              onChange={this.handleTextAreachange}
            />
          </Form.Field>
          <Button primary type="submit">
            Send
          </Button>
        </Form>
      </Segment>
    );
  }
}
