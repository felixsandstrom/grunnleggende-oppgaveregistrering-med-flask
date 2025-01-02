""".

Revision ID: ba72ab08b788
Revises: 
Create Date: 2024-12-14 18:08:31.461813

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'ba72ab08b788'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('suggestion_bug')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('suggestion_bug',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('type', mysql.VARCHAR(length=50), nullable=False),
    sa.Column('category', mysql.VARCHAR(length=100), nullable=False),
    sa.Column('description', mysql.TEXT(), nullable=False),
    sa.Column('created_by', mysql.VARCHAR(length=100), nullable=False),
    sa.Column('created_date', mysql.DATETIME(), nullable=True),
    sa.Column('priority', mysql.VARCHAR(length=50), nullable=False),
    sa.Column('status', mysql.VARCHAR(length=100), nullable=True),
    sa.Column('completed', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True),
    sa.Column('image_url', mysql.VARCHAR(length=200), nullable=True),
    sa.Column('app', mysql.VARCHAR(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    # ### end Alembic commands ###
