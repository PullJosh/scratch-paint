/**
 * @jest-environment jsdom
 */

/* eslint-env jest */

import React from 'react';
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../../../src/components/button/button';

describe('Button', () => {
    test('triggers callback when clicked', async () => {
        const onClick = jest.fn();
        render(
            <Button onClick={onClick}>
                {'Button'}
            </Button>
        );
        const user = userEvent.setup();
        await user.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalled();
    });
});
