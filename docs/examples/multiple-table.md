# Multiple Table

you can create multiple table in one page

for example in a view page lets say you want to show 2 tables with pagination, filter, action, search etc.

lets create a new variable `rewardDistribution` and `leaderboard` to be returned to the view

you also need to create a new custom view called `game_period/show`

```php
public function show(GamePeriod $gamePeriod): Response
{
    $rewardDistribution = GamePeriodTable::getRewardDistribution($gamePeriod);
    $leaderboard = GamePeriodTable::getLeaderboard($gamePeriod);

    return Inertia::render('game_period/show', [
        'rewardDistribution' => $rewardDistribution,
        'leaderboard' => $leaderboard,
        'form' => GamePeriodForm::view($gamePeriod),
        'routeName' => 'game_periods',
        'routeId' => $gamePeriod->id,
        'formClass' => GamePeriodForm::class,
    ]);
}
```

in `GamePeriodTable` class add this function

you need to set :

1. `dataName` : match according data name return from controller, this is for partial reload when state change.
2. `prefix` : can be anything / random, but unique, this is required to isolate table state from other table.

```php
public static function getLeaderboard(GamePeriod $gamePeriod)
{
    return Table::make(LeaderboardWithReward::class)
        ->dataName('leaderboard')
        ->prefix('lwr');
```

```php
public static function getRewardDistribution(GamePeriod $gamePeriod)
{
    return Table::make(LeaderboardReward::class)
        ->dataName('rewardDistribution')
        ->prefix('rd')
```

`game_period/show.tsx` sample file, in this file we add 2 `AppDataTable` after `AppFormBuilder`

```tsx
type Form = {
    columns: ColumnDef;
    fields: FieldDefinition[];
};

type PageProps = {
    rewardDistribution: DataTableProps;
    leaderboard: DataTableProps;
    form: Form;
    routeName: string;
    routeId?: string;
    formClass: string;
};

export default function Show({ rewardDistribution, leaderboard, form, routeName, routeId, formClass }: PageProps) {
    const { columns: formColumns, fields } = form;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: `${routeName}`, href: route(routeName + ".index") },
        { title: 'show', href: route(routeName + ".show", routeId) },
        { title: `#${routeId}`, href: '' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`show ${routeName} #${routeId}`} />
            <div className="p-4">
                <Card className="p-4 max-w-full">
                    <CardContent>
                        <AppFormBuilder columns={formColumns} fields={fields} routeName={routeName} routeId={routeId}
                            formClass={formClass} mode="show" />
                    </CardContent>
                </Card>
                <div className="py-4">
                    <h1 className="font-bold b-4">Reward Distribution</h1>
                    <AppDataTable data={rewardDistribution}
                        routeName="leaderboard_rewards"
                        tableRoute={route(routeName + ".show", routeId)}
                    >
                        {{
                            rowAction: (item, routeName) => (
                                <AppDatatableRowActions
                                    item={item}
                                    routeName={routeName}
                                    edit={rewardDistribution.edit}
                                    show={rewardDistribution.view}
                                    del={rewardDistribution.delete}
                                />
                            ),
                            toolbarAction: (
                                <>
                                </>
                            ),
                        }}
                    </AppDataTable>
                </div>
                <div className="py-4">
                    <h1 className="font-bold b-4">Leaderboard</h1>
                    <AppDataTable data={leaderboard}
                        routeName={routeName}
                        tableRoute={route(routeName + ".show", routeId)}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
```
