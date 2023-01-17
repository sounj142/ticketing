import { Link } from 'react-router-dom';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';

export default function NotFound() {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name='search' />
        Oops - Not Found
      </Header>
      <Segment.Inline>
        <Button as={Link} to='/tickets' primary>
          Return to tickets page
        </Button>
      </Segment.Inline>
    </Segment>
  );
}
